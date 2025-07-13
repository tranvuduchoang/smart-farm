import { Abi } from "viem";

// AgriChain Token ABI (ERC20)
export const AGRICHAIN_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function verifiedFarmers(address farmer) view returns (bool)",
  "function verifiedBuyers(address buyer) view returns (bool)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function farmerRewardRate() view returns (uint256)",
  "function buyerRewardRate() view returns (uint256)",
  "function reviewRewardRate() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event FarmerVerified(address indexed farmer)",
  "event BuyerVerified(address indexed buyer)",
  "event RewardPaid(address indexed recipient, uint256 amount, string reason)",
] as const;

// AgriChain NFT ABI (ERC1155)
export const AGRICHAIN_NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address account, address operator) view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
  "function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)",
  "function uri(uint256 id) view returns (string)",
  "function getProductCertification(uint256 tokenId) view returns (tuple(uint256,address,string,string,string,string,uint256,uint256,string,bool))",
  "function getQualityMetrics(uint256 tokenId) view returns (tuple(uint256,uint256,uint256,string[],string))",
  "function productHashToTokenId(bytes32 hash) view returns (uint256)",
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
  "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
  "event ProductCertified(uint256 indexed tokenId, address indexed farmer, string productName, string batchNumber)",
  "event QualityScoreUpdated(uint256 indexed tokenId, uint256 nutritionalScore, uint256 freshnessScore, uint256 sustainabilityScore)",
] as const;

// AgriChain Marketplace ABI
export const AGRICHAIN_MARKETPLACE_ABI = [
  "function createListing(uint256 nftTokenId, uint256 quantity, uint256 pricePerUnit, uint256 pricePerUnitETH, bool acceptsETH, bool acceptsAGRI, uint256 duration) returns (uint256)",
  "function createOrder(uint256 listingId, uint256 quantity, bool payWithETH, string shippingAddress) payable returns (uint256)",
  "function confirmOrder(uint256 orderId)",
  "function shipOrder(uint256 orderId)",
  "function deliverOrder(uint256 orderId)",
  "function cancelListing(uint256 listingId)",
  "function listings(uint256 listingId) view returns (tuple(uint256,address,uint256,uint256,uint256,uint256,bool,bool,bool,uint256,uint256))",
  "function orders(uint256 orderId) view returns (tuple(uint256,uint256,address,address,uint256,uint256,address,uint8,uint256,uint256,string))",
  "function getSellerListings(address seller) view returns (uint256[])",
  "function getBuyerOrders(address buyer) view returns (uint256[])",
  "function platformFeePercent() view returns (uint256)",
  "event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 indexed nftTokenId, uint256 quantity, uint256 pricePerUnit, uint256 pricePerUnitETH)",
  "event OrderCreated(uint256 indexed orderId, uint256 indexed listingId, address indexed buyer, uint256 quantity, uint256 totalPrice)",
  "event OrderStatusUpdated(uint256 indexed orderId, uint8 status)",
  "event ListingCancelled(uint256 indexed listingId)",
] as const;

// TypeScript interfaces
export interface ProductCertification {
  tokenId: bigint;
  farmer: string;
  productName: string;
  productType: string;
  farmLocation: string;
  certificationLevel: string;
  harvestDate: bigint;
  expiryDate: bigint;
  batchNumber: string;
  isActive: boolean;
}

export interface QualityMetrics {
  nutritionalScore: bigint;
  freshnessScore: bigint;
  sustainabilityScore: bigint;
  certifications: string[];
  qualityGrade: string;
}

export interface Listing {
  listingId: bigint;
  seller: string;
  nftTokenId: bigint;
  quantity: bigint;
  pricePerUnit: bigint;
  pricePerUnitETH: bigint;
  acceptsETH: boolean;
  acceptsAGRI: boolean;
  isActive: boolean;
  createdAt: bigint;
  expiresAt: bigint;
}

export interface Order {
  orderId: bigint;
  listingId: bigint;
  buyer: string;
  seller: string;
  quantity: bigint;
  totalPrice: bigint;
  paymentToken: string;
  status: OrderStatus;
  createdAt: bigint;
  deliveryDate: bigint;
  shippingAddress: string;
}

export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
  Disputed = 5,
}

// Helper functions
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
): string {
  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  const remainderStr = remainder.toString().padStart(decimals, "0");
  const trimmedRemainder = remainderStr.replace(/0+$/, "");

  if (trimmedRemainder === "") {
    return quotient.toString();
  }

  return `${quotient}.${trimmedRemainder}`;
}

export function parseTokenAmount(
  amount: string,
  decimals: number = 18,
): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

export function getOrderStatusText(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return "Đang chờ xác nhận";
    case OrderStatus.Confirmed:
      return "Đã xác nhận";
    case OrderStatus.Shipped:
      return "Đang giao hàng";
    case OrderStatus.Delivered:
      return "Đã giao hàng";
    case OrderStatus.Cancelled:
      return "Đã hủy";
    case OrderStatus.Disputed:
      return "Đang tranh chấp";
    default:
      return "Không xác định";
  }
}

export function getCertificationLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case "organic":
      return "green";
    case "bio":
      return "blue";
    case "traditional":
      return "orange";
    default:
      return "gray";
  }
}

export function getQualityGradeColor(grade: string): string {
  switch (grade) {
    case "A+":
      return "green";
    case "A":
      return "lime";
    case "B+":
      return "yellow";
    case "B":
      return "orange";
    case "C":
      return "red";
    default:
      return "gray";
  }
}
