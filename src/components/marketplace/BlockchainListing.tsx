"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  useCreateListing,
  useCreateOrder,
  useListing,
  useTokenBalance,
  useApproveToken,
  useTokenAllowance,
  formatBalance,
  formatPrice,
} from "@/hooks/useAgriChain";
import { AGRICHAIN_MARKETPLACE_ADDRESS } from "@/lib/web3Config";
import { ProductCertificationCompact } from "@/components/nft/ProductCertification";
import { Button } from "@/components/ui/button/button";
import "./BlockchainListing.css";

interface CreateListingProps {
  nftTokenId: number;
  onSuccess?: () => void;
}

export function CreateListing({ nftTokenId, onSuccess }: CreateListingProps) {
  const { address, chainId } = useAccount();
  const { createListing, isPending } = useCreateListing();

  const [formData, setFormData] = useState({
    quantity: 1,
    pricePerUnit: "",
    pricePerUnitETH: "",
    acceptsETH: true,
    acceptsAGRI: true,
    duration: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chainId) {
      alert("Vui lòng kết nối ví");
      return;
    }

    try {
      createListing({
        nftTokenId,
        quantity: formData.quantity,
        pricePerUnit: formData.pricePerUnit,
        pricePerUnitETH: formData.pricePerUnitETH,
        acceptsETH: formData.acceptsETH,
        acceptsAGRI: formData.acceptsAGRI,
        duration: formData.duration,
        chainId,
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="create-listing">
      <h3>Tạo listing cho NFT #{nftTokenId}</h3>

      <ProductCertificationCompact tokenId={nftTokenId} />

      <form onSubmit={handleSubmit} className="listing-form">
        <div className="form-group">
          <label>Số lượng:</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Giá AGRI Token (mỗi đơn vị):</label>
          <input
            type="number"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={(e) =>
              setFormData({ ...formData, pricePerUnit: e.target.value })
            }
            placeholder="100"
            disabled={!formData.acceptsAGRI}
          />
        </div>

        <div className="form-group">
          <label>Giá ETH (mỗi đơn vị):</label>
          <input
            type="number"
            step="0.001"
            value={formData.pricePerUnitETH}
            onChange={(e) =>
              setFormData({ ...formData, pricePerUnitETH: e.target.value })
            }
            placeholder="0.01"
            disabled={!formData.acceptsETH}
          />
        </div>

        <div className="payment-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.acceptsETH}
              onChange={(e) =>
                setFormData({ ...formData, acceptsETH: e.target.checked })
              }
            />
            Chấp nh��n thanh toán bằng ETH
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.acceptsAGRI}
              onChange={(e) =>
                setFormData({ ...formData, acceptsAGRI: e.target.checked })
              }
            />
            Chấp nhận thanh toán bằng AGRI Token
          </label>
        </div>

        <div className="form-group">
          <label>Thời hạn:</label>
          <select
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) })
            }
          >
            <option value={24 * 60 * 60}>1 ngày</option>
            <option value={3 * 24 * 60 * 60}>3 ngày</option>
            <option value={7 * 24 * 60 * 60}>7 ngày</option>
            <option value={14 * 24 * 60 * 60}>14 ngày</option>
            <option value={30 * 24 * 60 * 60}>30 ngày</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={
            isPending || (!formData.acceptsETH && !formData.acceptsAGRI)
          }
          className="create-listing-btn"
        >
          {isPending ? "Đang tạo..." : "Tạo listing"}
        </Button>
      </form>
    </div>
  );
}

interface ListingDisplayProps {
  listingId: number;
  onOrderCreated?: () => void;
}

export function ListingDisplay({
  listingId,
  onOrderCreated,
}: ListingDisplayProps) {
  const { address, chainId } = useAccount();
  const { data: listingData } = useListing(listingId);
  const { data: tokenBalance } = useTokenBalance();
  const { createOrder, isPending: orderPending } = useCreateOrder();
  const { approve, isPending: approvePending } = useApproveToken();
  const { data: allowance } = useTokenAllowance(
    chainId
      ? AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ]
      : "",
  );

  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    payWithETH: true,
    shippingAddress: "",
  });

  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    if (listingData) {
      setListing({
        listingId: Number(listingData[0]),
        seller: listingData[1],
        nftTokenId: Number(listingData[2]),
        quantity: Number(listingData[3]),
        pricePerUnit: listingData[4],
        pricePerUnitETH: listingData[5],
        acceptsETH: listingData[6],
        acceptsAGRI: listingData[7],
        isActive: listingData[8],
        createdAt: Number(listingData[9]),
        expiresAt: Number(listingData[10]),
      });
    }
  }, [listingData]);

  if (!listing) {
    return <div className="listing-loading">Đang tải thông tin listing...</div>;
  }

  const isExpired = new Date(listing.expiresAt * 1000) < new Date();
  const isOwner = address === listing.seller;
  const totalAGRIPrice =
    BigInt(listing.pricePerUnit) * BigInt(orderForm.quantity);
  const totalETHPrice =
    BigInt(listing.pricePerUnitETH) * BigInt(orderForm.quantity);
  const needsApproval =
    !orderForm.payWithETH && allowance && allowance < totalAGRIPrice;

  const handleApprove = async () => {
    if (!chainId) return;

    approve({
      spender:
        AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ],
      amount: formatBalance(totalAGRIPrice),
      chainId,
    });
  };

  const handleCreateOrder = async () => {
    if (!chainId) return;

    try {
      createOrder({
        listingId: listing.listingId,
        quantity: orderForm.quantity,
        payWithETH: orderForm.payWithETH,
        shippingAddress: orderForm.shippingAddress,
        ethValue: orderForm.payWithETH ? formatPrice(totalETHPrice) : undefined,
        chainId,
      });

      onOrderCreated?.();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div
      className={`listing-display ${!listing.isActive ? "inactive" : ""} ${isExpired ? "expired" : ""}`}
    >
      <div className="listing-header">
        <h3>Listing #{listing.listingId}</h3>
        <div className="listing-status">
          {!listing.isActive && (
            <span className="status-badge inactive">Không hoạt động</span>
          )}
          {isExpired && (
            <span className="status-badge expired">Đã hết hạn</span>
          )}
          {isOwner && <span className="status-badge owner">Của bạn</span>}
        </div>
      </div>

      <ProductCertificationCompact tokenId={listing.nftTokenId} />

      <div className="listing-details">
        <div className="price-info">
          <h4>Thông tin giá:</h4>
          {listing.acceptsAGRI && (
            <div className="price-item">
              <span>AGRI Token:</span>
              <span className="price">
                {formatBalance(listing.pricePerUnit)} AGRI
              </span>
            </div>
          )}
          {listing.acceptsETH && (
            <div className="price-item">
              <span>ETH:</span>
              <span className="price">
                {formatPrice(listing.pricePerUnitETH)} ETH
              </span>
            </div>
          )}
        </div>

        <div className="quantity-info">
          <p>
            <strong>Số lượng có sẵn:</strong> {listing.quantity}
          </p>
          <p>
            <strong>Người bán:</strong> {listing.seller}
          </p>
          <p>
            <strong>Hết hạn:</strong>{" "}
            {new Date(listing.expiresAt * 1000).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>

      {!isOwner && listing.isActive && !isExpired && (
        <div className="order-form">
          <h4>Đặt hàng:</h4>

          <div className="form-group">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              max={listing.quantity}
              value={orderForm.quantity}
              onChange={(e) =>
                setOrderForm({
                  ...orderForm,
                  quantity: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="payment-method">
            <h5>Phương thức thanh toán:</h5>
            {listing.acceptsETH && (
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={orderForm.payWithETH}
                  onChange={() =>
                    setOrderForm({ ...orderForm, payWithETH: true })
                  }
                />
                ETH ({formatPrice(totalETHPrice)} ETH)
              </label>
            )}
            {listing.acceptsAGRI && (
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={!orderForm.payWithETH}
                  onChange={() =>
                    setOrderForm({ ...orderForm, payWithETH: false })
                  }
                />
                AGRI Token ({formatBalance(totalAGRIPrice)} AGRI)
              </label>
            )}
          </div>

          {!orderForm.payWithETH &&
            tokenBalance &&
            tokenBalance < totalAGRIPrice && (
              <div className="insufficient-balance">
                ⚠️ Số dư AGRI không đủ. Bạn có: {formatBalance(tokenBalance)}{" "}
                AGRI
              </div>
            )}

          <div className="form-group">
            <label>Địa chỉ giao hàng:</label>
            <textarea
              value={orderForm.shippingAddress}
              onChange={(e) =>
                setOrderForm({ ...orderForm, shippingAddress: e.target.value })
              }
              placeholder="Nhập địa chỉ giao hàng đầy đủ..."
              required
            />
          </div>

          <div className="order-actions">
            {needsApproval && (
              <Button
                onClick={handleApprove}
                disabled={approvePending}
                className="approve-btn"
              >
                {approvePending ? "Đang duyệt..." : "Duyệt AGRI Token"}
              </Button>
            )}

            <Button
              onClick={handleCreateOrder}
              disabled={
                orderPending ||
                !orderForm.shippingAddress ||
                needsApproval ||
                (!orderForm.payWithETH &&
                  tokenBalance &&
                  tokenBalance < totalAGRIPrice)
              }
              className="order-btn"
            >
              {orderPending ? "Đang đặt hàng..." : "Đặt hàng"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MarketplaceGridProps {
  listings: number[];
}

export function MarketplaceGrid({ listings }: MarketplaceGridProps) {
  return (
    <div className="marketplace-grid">
      {listings.map((listingId) => (
        <ListingDisplay key={listingId} listingId={listingId} />
      ))}
      {listings.length === 0 && (
        <div className="empty-marketplace">
          <p>Chưa có sản phẩm nào được đăng bán.</p>
        </div>
      )}
    </div>
  );
}
