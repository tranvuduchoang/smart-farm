// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

interface IAgriChainToken is IERC20 {
    function rewardPurchase(address buyer) external;
    function verifiedFarmers(address farmer) external view returns (bool);
    function verifiedBuyers(address buyer) external view returns (bool);
}

interface IAgriChainNFT is IERC1155 {
    function getProductCertification(uint256 tokenId) external view returns (
        uint256 tokenId,
        address farmer,
        string memory productName,
        string memory productType,
        string memory farmLocation,
        string memory certificationLevel,
        uint256 harvestDate,
        uint256 expiryDate,
        string memory batchNumber,
        bool isActive
    );
}

contract AgriChainMarketplace is ReentrancyGuard, Ownable, Pausable, ERC1155Holder {
    IAgriChainToken public immutable agriToken;
    IAgriChainNFT public immutable agriNFT;
    
    uint256 private _listingIdCounter;
    uint256 public platformFeePercent = 250; // 2.5%
    uint256 public constant MAX_FEE_PERCENT = 1000; // 10%
    
    struct Listing {
        uint256 listingId;
        address seller;
        uint256 nftTokenId;
        uint256 quantity;
        uint256 pricePerUnit; // in AGRI tokens
        uint256 pricePerUnitETH; // in ETH
        bool acceptsETH;
        bool acceptsAGRI;
        bool isActive;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    struct Order {
        uint256 orderId;
        uint256 listingId;
        address buyer;
        address seller;
        uint256 quantity;
        uint256 totalPrice;
        address paymentToken; // address(0) for ETH, agriToken address for AGRI
        OrderStatus status;
        uint256 createdAt;
        uint256 deliveryDate;
        string shippingAddress;
    }
    
    enum OrderStatus {
        Pending,
        Confirmed,
        Shipped,
        Delivered,
        Cancelled,
        Disputed
    }
    
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => uint256[]) public buyerOrders;
    
    uint256 private _orderIdCounter;
    
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 indexed nftTokenId,
        uint256 quantity,
        uint256 pricePerUnit,
        uint256 pricePerUnitETH
    );
    
    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed listingId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );
    
    event OrderStatusUpdated(
        uint256 indexed orderId,
        OrderStatus status
    );
    
    event ListingCancelled(uint256 indexed listingId);
    
    constructor(
        address _agriToken,
        address _agriNFT,
        address initialOwner
    ) Ownable(initialOwner) {
        agriToken = IAgriChainToken(_agriToken);
        agriNFT = IAgriChainNFT(_agriNFT);
        _listingIdCounter = 1;
        _orderIdCounter = 1;
    }

    function createListing(
        uint256 nftTokenId,
        uint256 quantity,
        uint256 pricePerUnit,
        uint256 pricePerUnitETH,
        bool acceptsETH,
        bool acceptsAGRI,
        uint256 duration
    ) external whenNotPaused returns (uint256) {
        require(agriToken.verifiedFarmers(msg.sender), "Seller must be verified farmer");
        require(quantity > 0, "Quantity must be greater than 0");
        require(pricePerUnit > 0 || pricePerUnitETH > 0, "Price must be greater than 0");
        require(acceptsETH || acceptsAGRI, "Must accept at least one payment method");
        require(duration > 0, "Duration must be greater than 0");
        
        // Verify NFT ownership and approval
        require(
            agriNFT.balanceOf(msg.sender, nftTokenId) >= quantity,
            "Insufficient NFT balance"
        );
        
        // Transfer NFTs to marketplace
        agriNFT.safeTransferFrom(msg.sender, address(this), nftTokenId, quantity, "");
        
        uint256 listingId = _listingIdCounter++;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftTokenId: nftTokenId,
            quantity: quantity,
            pricePerUnit: pricePerUnit,
            pricePerUnitETH: pricePerUnitETH,
            acceptsETH: acceptsETH,
            acceptsAGRI: acceptsAGRI,
            isActive: true,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + duration
        });
        
        sellerListings[msg.sender].push(listingId);
        
        emit ListingCreated(
            listingId,
            msg.sender,
            nftTokenId,
            quantity,
            pricePerUnit,
            pricePerUnitETH
        );
        
        return listingId;
    }

    function createOrder(
        uint256 listingId,
        uint256 quantity,
        bool payWithETH,
        string memory shippingAddress
    ) external payable whenNotPaused nonReentrant returns (uint256) {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(block.timestamp < listing.expiresAt, "Listing has expired");
        require(quantity > 0 && quantity <= listing.quantity, "Invalid quantity");
        require(agriToken.verifiedBuyers(msg.sender), "Buyer must be verified");
        
        uint256 totalPrice;
        address paymentToken;
        
        if (payWithETH) {
            require(listing.acceptsETH, "Listing does not accept ETH");
            totalPrice = listing.pricePerUnitETH * quantity;
            require(msg.value >= totalPrice, "Insufficient ETH sent");
            paymentToken = address(0);
        } else {
            require(listing.acceptsAGRI, "Listing does not accept AGRI tokens");
            totalPrice = listing.pricePerUnit * quantity;
            require(
                agriToken.transferFrom(msg.sender, address(this), totalPrice),
                "AGRI token transfer failed"
            );
            paymentToken = address(agriToken);
        }
        
        uint256 orderId = _orderIdCounter++;
        
        orders[orderId] = Order({
            orderId: orderId,
            listingId: listingId,
            buyer: msg.sender,
            seller: listing.seller,
            quantity: quantity,
            totalPrice: totalPrice,
            paymentToken: paymentToken,
            status: OrderStatus.Pending,
            createdAt: block.timestamp,
            deliveryDate: 0,
            shippingAddress: shippingAddress
        });
        
        buyerOrders[msg.sender].push(orderId);
        
        // Update listing quantity
        listing.quantity -= quantity;
        if (listing.quantity == 0) {
            listing.isActive = false;
        }
        
        emit OrderCreated(orderId, listingId, msg.sender, quantity, totalPrice);
        
        // Refund excess ETH
        if (payWithETH && msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        return orderId;
    }

    function confirmOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.seller == msg.sender, "Only seller can confirm");
        require(order.status == OrderStatus.Pending, "Invalid order status");
        
        order.status = OrderStatus.Confirmed;
        emit OrderStatusUpdated(orderId, OrderStatus.Confirmed);
    }

    function shipOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.seller == msg.sender, "Only seller can ship");
        require(order.status == OrderStatus.Confirmed, "Order must be confirmed first");
        
        order.status = OrderStatus.Shipped;
        emit OrderStatusUpdated(orderId, OrderStatus.Shipped);
    }

    function deliverOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.buyer == msg.sender, "Only buyer can confirm delivery");
        require(order.status == OrderStatus.Shipped, "Order must be shipped first");
        
        order.status = OrderStatus.Delivered;
        order.deliveryDate = block.timestamp;
        
        // Calculate platform fee
        uint256 platformFee = (order.totalPrice * platformFeePercent) / 10000;
        uint256 sellerAmount = order.totalPrice - platformFee;
        
        // Transfer payment to seller
        if (order.paymentToken == address(0)) {
            // ETH payment
            payable(order.seller).transfer(sellerAmount);
            payable(owner()).transfer(platformFee);
        } else {
            // AGRI token payment
            agriToken.transfer(order.seller, sellerAmount);
            agriToken.transfer(owner(), platformFee);
        }
        
        // Transfer NFT to buyer
        agriNFT.safeTransferFrom(
            address(this),
            order.buyer,
            listings[order.listingId].nftTokenId,
            order.quantity,
            ""
        );
        
        // Reward buyer with AGRI tokens
        agriToken.rewardPurchase(order.buyer);
        
        emit OrderStatusUpdated(orderId, OrderStatus.Delivered);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Only seller can cancel");
        require(listing.isActive, "Listing is not active");
        
        listing.isActive = false;
        
        // Return NFTs to seller
        agriNFT.safeTransferFrom(
            address(this),
            listing.seller,
            listing.nftTokenId,
            listing.quantity,
            ""
        );
        
        emit ListingCancelled(listingId);
    }

    function setPlatformFeePercent(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= MAX_FEE_PERCENT, "Fee too high");
        platformFeePercent = _feePercent;
    }

    function getSellerListings(address seller) external view returns (uint256[] memory) {
        return sellerListings[seller];
    }

    function getBuyerOrders(address buyer) external view returns (uint256[] memory) {
        return buyerOrders[buyer];
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
        uint256 agriBalance = agriToken.balanceOf(address(this));
        if (agriBalance > 0) {
            agriToken.transfer(owner(), agriBalance);
        }
    }
}
