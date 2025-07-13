// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AgriChainNFT is ERC1155, Ownable, Pausable {
    using Strings for uint256;

    string private _baseTokenURI;
    uint256 private _tokenIdCounter;
    
    struct ProductCertification {
        uint256 tokenId;
        address farmer;
        string productName;
        string productType;
        string farmLocation;
        string certificationLevel; // Organic, Bio, Traditional
        uint256 harvestDate;
        uint256 expiryDate;
        string batchNumber;
        bool isActive;
    }
    
    struct QualityMetrics {
        uint256 nutritionalScore;
        uint256 freshnessScore;
        uint256 sustainabilityScore;
        string[] certifications; // ["Organic", "Fair Trade", "Local"]
        string qualityGrade; // A+, A, B+, B, C
    }
    
    mapping(uint256 => ProductCertification) public productCertifications;
    mapping(uint256 => QualityMetrics) public qualityMetrics;
    mapping(address => bool) public authorizedMinters;
    mapping(bytes32 => uint256) public productHashToTokenId;
    
    event ProductCertified(
        uint256 indexed tokenId,
        address indexed farmer,
        string productName,
        string batchNumber
    );
    
    event QualityScoreUpdated(
        uint256 indexed tokenId,
        uint256 nutritionalScore,
        uint256 freshnessScore,
        uint256 sustainabilityScore
    );

    constructor(
        string memory baseURI,
        address initialOwner
    ) ERC1155(baseURI) Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        _tokenIdCounter = 1;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function certifyProduct(
        address farmer,
        string memory productName,
        string memory productType,
        string memory farmLocation,
        string memory certificationLevel,
        uint256 harvestDate,
        uint256 expiryDate,
        string memory batchNumber,
        uint256 quantity
    ) external returns (uint256) {
        require(
            authorizedMinters[msg.sender] || owner() == msg.sender,
            "Not authorized to mint"
        );
        
        uint256 tokenId = _tokenIdCounter++;
        bytes32 productHash = keccak256(
            abi.encodePacked(farmer, productName, batchNumber, harvestDate)
        );
        
        productCertifications[tokenId] = ProductCertification({
            tokenId: tokenId,
            farmer: farmer,
            productName: productName,
            productType: productType,
            farmLocation: farmLocation,
            certificationLevel: certificationLevel,
            harvestDate: harvestDate,
            expiryDate: expiryDate,
            batchNumber: batchNumber,
            isActive: true
        });
        
        productHashToTokenId[productHash] = tokenId;
        
        _mint(farmer, tokenId, quantity, "");
        
        emit ProductCertified(tokenId, farmer, productName, batchNumber);
        
        return tokenId;
    }

    function setQualityMetrics(
        uint256 tokenId,
        uint256 nutritionalScore,
        uint256 freshnessScore,
        uint256 sustainabilityScore,
        string[] memory certifications,
        string memory qualityGrade
    ) external {
        require(
            authorizedMinters[msg.sender] || owner() == msg.sender,
            "Not authorized"
        );
        require(_exists(tokenId), "Token does not exist");
        
        qualityMetrics[tokenId] = QualityMetrics({
            nutritionalScore: nutritionalScore,
            freshnessScore: freshnessScore,
            sustainabilityScore: sustainabilityScore,
            certifications: certifications,
            qualityGrade: qualityGrade
        });
        
        emit QualityScoreUpdated(tokenId, nutritionalScore, freshnessScore, sustainabilityScore);
    }

    function revokeProductCertification(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        productCertifications[tokenId].isActive = false;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function getProductCertification(uint256 tokenId) 
        external 
        view 
        returns (ProductCertification memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return productCertifications[tokenId];
    }

    function getQualityMetrics(uint256 tokenId) 
        external 
        view 
        returns (QualityMetrics memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return qualityMetrics[tokenId];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return productCertifications[tokenId].farmer != address(0);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
