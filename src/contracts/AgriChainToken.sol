// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AgriChainToken is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    // Reward rates
    uint256 public farmerRewardRate = 100 * 10**18; // 100 tokens per verified product
    uint256 public buyerRewardRate = 10 * 10**18;   // 10 tokens per purchase
    uint256 public reviewRewardRate = 5 * 10**18;   // 5 tokens per review
    
    mapping(address => bool) public verifiedFarmers;
    mapping(address => bool) public verifiedBuyers;
    mapping(bytes32 => bool) public productCertified;
    
    event FarmerVerified(address indexed farmer);
    event BuyerVerified(address indexed buyer);
    event ProductCertified(bytes32 indexed productHash, address indexed farmer);
    event RewardPaid(address indexed recipient, uint256 amount, string reason);

    constructor(address initialOwner) ERC20("AgriChain Token", "AGRI") Ownable(initialOwner) {
        _mint(initialOwner, 100000000 * 10**18); // Initial mint: 100M tokens
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(to, amount);
    }

    function verifyFarmer(address farmer) external onlyOwner {
        verifiedFarmers[farmer] = true;
        emit FarmerVerified(farmer);
    }

    function verifyBuyer(address buyer) external onlyOwner {
        verifiedBuyers[buyer] = true;
        emit BuyerVerified(buyer);
    }

    function certifyProduct(bytes32 productHash, address farmer) external onlyOwner {
        require(verifiedFarmers[farmer], "Farmer not verified");
        productCertified[productHash] = true;
        
        // Reward farmer for product certification
        _mint(farmer, farmerRewardRate);
        emit ProductCertified(productHash, farmer);
        emit RewardPaid(farmer, farmerRewardRate, "Product Certification");
    }

    function rewardPurchase(address buyer) external onlyOwner {
        require(verifiedBuyers[buyer], "Buyer not verified");
        _mint(buyer, buyerRewardRate);
        emit RewardPaid(buyer, buyerRewardRate, "Purchase");
    }

    function rewardReview(address reviewer) external onlyOwner {
        _mint(reviewer, reviewRewardRate);
        emit RewardPaid(reviewer, reviewRewardRate, "Review");
    }

    function setRewardRates(
        uint256 _farmerRewardRate,
        uint256 _buyerRewardRate,
        uint256 _reviewRewardRate
    ) external onlyOwner {
        farmerRewardRate = _farmerRewardRate;
        buyerRewardRate = _buyerRewardRate;
        reviewRewardRate = _reviewRewardRate;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
