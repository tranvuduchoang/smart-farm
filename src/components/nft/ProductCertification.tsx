"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  useProductCertification,
  useQualityMetrics,
} from "@/hooks/useAgriChain";
import {
  ProductCertification as ProductCertType,
  QualityMetrics,
  getCertificationLevelColor,
  getQualityGradeColor,
} from "@/lib/contracts";
import { Button } from "@/components/ui/button/button";
import "./ProductCertification.css";

interface ProductCertificationProps {
  tokenId: number;
  showFullDetails?: boolean;
  onViewDetails?: () => void;
}

export function ProductCertification({
  tokenId,
  showFullDetails = false,
  onViewDetails,
}: ProductCertificationProps) {
  const { address } = useAccount();
  const { data: certification, isLoading: certLoading } =
    useProductCertification(tokenId);
  const { data: quality, isLoading: qualityLoading } =
    useQualityMetrics(tokenId);

  const [certData, setCertData] = useState<ProductCertType | null>(null);
  const [qualityData, setQualityData] = useState<QualityMetrics | null>(null);

  useEffect(() => {
    if (certification) {
      setCertData({
        tokenId: certification[0],
        farmer: certification[1],
        productName: certification[2],
        productType: certification[3],
        farmLocation: certification[4],
        certificationLevel: certification[5],
        harvestDate: certification[6],
        expiryDate: certification[7],
        batchNumber: certification[8],
        isActive: certification[9],
      });
    }
  }, [certification]);

  useEffect(() => {
    if (quality) {
      setQualityData({
        nutritionalScore: quality[0],
        freshnessScore: quality[1],
        sustainabilityScore: quality[2],
        certifications: quality[3],
        qualityGrade: quality[4],
      });
    }
  }, [quality]);

  if (certLoading || qualityLoading) {
    return (
      <div className="certification-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin chứng thực...</p>
      </div>
    );
  }

  if (!certData) {
    return (
      <div className="certification-error">
        <p>Không tìm thấy thông tin chứng thực cho sản phẩm này.</p>
      </div>
    );
  }

  const isExpired =
    certData.expiryDate &&
    new Date(Number(certData.expiryDate) * 1000) < new Date();
  const harvestDate = new Date(Number(certData.harvestDate) * 1000);
  const expiryDate = certData.expiryDate
    ? new Date(Number(certData.expiryDate) * 1000)
    : null;

  return (
    <div
      className={`product-certification ${!certData.isActive ? "inactive" : ""} ${isExpired ? "expired" : ""}`}
    >
      <div className="certification-header">
        <div className="certification-badge">
          <span className="nft-icon">🏅</span>
          <div className="badge-info">
            <h3>Chứng thực NFT #{tokenId}</h3>
            <p className="token-id">Token ID: {tokenId}</p>
          </div>
        </div>

        {!certData.isActive && (
          <div className="status-badge inactive">Không hoạt động</div>
        )}
        {isExpired && <div className="status-badge expired">Đã hết hạn</div>}
      </div>

      <div className="certification-content">
        <div className="product-info">
          <h4 className="product-name">{certData.productName}</h4>
          <p className="product-type">Loại: {certData.productType}</p>
          <p className="farm-location">📍 {certData.farmLocation}</p>
          <p className="batch-number">Lô sản xuất: {certData.batchNumber}</p>
        </div>

        <div className="certification-level">
          <span
            className={`level-badge ${getCertificationLevelColor(certData.certificationLevel)}`}
          >
            {certData.certificationLevel}
          </span>
        </div>

        {qualityData && (
          <div className="quality-metrics">
            <div className="quality-scores">
              <div className="score-item">
                <span className="score-label">Dinh dưỡng</span>
                <div className="score-bar">
                  <div
                    className="score-fill nutrition"
                    style={{
                      width: `${Number(qualityData.nutritionalScore)}%`,
                    }}
                  ></div>
                </div>
                <span className="score-value">
                  {Number(qualityData.nutritionalScore)}
                </span>
              </div>

              <div className="score-item">
                <span className="score-label">Tươi mới</span>
                <div className="score-bar">
                  <div
                    className="score-fill freshness"
                    style={{ width: `${Number(qualityData.freshnessScore)}%` }}
                  ></div>
                </div>
                <span className="score-value">
                  {Number(qualityData.freshnessScore)}
                </span>
              </div>

              <div className="score-item">
                <span className="score-label">Bền vững</span>
                <div className="score-bar">
                  <div
                    className="score-fill sustainability"
                    style={{
                      width: `${Number(qualityData.sustainabilityScore)}%`,
                    }}
                  ></div>
                </div>
                <span className="score-value">
                  {Number(qualityData.sustainabilityScore)}
                </span>
              </div>
            </div>

            {qualityData.qualityGrade && (
              <div className="quality-grade">
                <span
                  className={`grade-badge ${getQualityGradeColor(qualityData.qualityGrade)}`}
                >
                  Hạng {qualityData.qualityGrade}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="dates-info">
          <div className="date-item">
            <span className="date-label">Thu hoạch:</span>
            <span className="date-value">
              {harvestDate.toLocaleDateString("vi-VN")}
            </span>
          </div>
          {expiryDate && (
            <div className="date-item">
              <span className="date-label">Hết hạn:</span>
              <span className={`date-value ${isExpired ? "expired" : ""}`}>
                {expiryDate.toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>

        {qualityData?.certifications &&
          qualityData.certifications.length > 0 && (
            <div className="additional-certifications">
              <h5>Chứng nhận bổ sung:</h5>
              <div className="cert-tags">
                {qualityData.certifications.map((cert, index) => (
                  <span key={index} className="cert-tag">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

        <div className="farmer-info">
          <h5>Thông tin nông dân:</h5>
          <p className="farmer-address">{certData.farmer}</p>
          {address === certData.farmer && (
            <span className="owner-badge">Bạn sở hữu NFT này</span>
          )}
        </div>

        {!showFullDetails && onViewDetails && (
          <Button onClick={onViewDetails} className="view-details-btn">
            Xem chi tiết
          </Button>
        )}
      </div>

      {showFullDetails && (
        <div className="blockchain-info">
          <h5>Thông tin Blockchain:</h5>
          <div className="blockchain-details">
            <p>
              <strong>Token ID:</strong> {Number(certData.tokenId)}
            </p>
            <p>
              <strong>Farmer Address:</strong> {certData.farmer}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {certData.isActive ? "Hoạt động" : "Không hoạt động"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for listings
export function ProductCertificationCompact({ tokenId }: { tokenId: number }) {
  return <ProductCertification tokenId={tokenId} showFullDetails={false} />;
}

// Full details version
export function ProductCertificationFull({ tokenId }: { tokenId: number }) {
  return <ProductCertification tokenId={tokenId} showFullDetails={true} />;
}
