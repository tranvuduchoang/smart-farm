"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/button/button";
import { useVerificationStatus } from "@/hooks/useAgriChain";
import "./verification.css";

interface KYCFormData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  governmentId: string;
  governmentIdType: "passport" | "driver_license" | "national_id";
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  businessName?: string;
  businessType?: "individual" | "partnership" | "corporation";
  businessRegistration?: string;
  taxId?: string;
  idDocumentUrl: string;
  proofOfAddressUrl: string;
  businessDocumentUrl?: string;
  farmCertificateUrl?: string;
}

interface VerificationData {
  kycStatus: string;
  kycVerifiedAt: string | null;
  walletVerified: boolean;
  walletAddress: string | null;
  farmerVerified: boolean;
  buyerVerified: boolean;
  canVerifyFarmer: boolean;
  canVerifyBuyer: boolean;
}

export default function VerificationPage() {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();
  const { signMessage } = useSignMessage();

  const [step, setStep] = useState(1);
  const [kycData, setKycData] = useState<Partial<KYCFormData>>({});
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      fetchVerificationStatus();
    }
  }, [session]);

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch("/api/web3/verify-role");
      if (response.ok) {
        const data = await response.json();
        setVerificationData(data);

        // Determine which step to show based on verification status
        if (data.kycStatus === "APPROVED" && data.walletVerified) {
          setStep(3); // Role verification
        } else if (data.kycStatus === "APPROVED") {
          setStep(2); // Wallet verification
        } else {
          setStep(1); // KYC
        }
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kycData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(
          "KYC document submitted successfully! Please wait for admin approval.",
        );
        setStep(2);
        fetchVerificationStatus();
      } else {
        setMessage(result.error || "Failed to submit KYC document");
      }
    } catch (error) {
      setMessage("An error occurred while submitting KYC document");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletVerification = async () => {
    if (!isConnected || !address) {
      setMessage("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Get verification message
      const messageResponse = await fetch("/api/web3/verify-wallet", {
        method: "PUT",
      });
      const { message: verificationMessage } = await messageResponse.json();

      // Sign the message
      const signature = await signMessage({ message: verificationMessage });

      // Verify wallet
      const response = await fetch("/api/web3/verify-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message: verificationMessage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Wallet verified successfully!");
        setStep(3);
        fetchVerificationStatus();
      } else {
        setMessage(result.error || "Failed to verify wallet");
      }
    } catch (error) {
      setMessage("An error occurred during wallet verification");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleVerification = async (role: "farmer" | "buyer") => {
    setLoading(true);
    setMessage("");

    try {
      // This would typically interact with smart contract
      // For now, we'll simulate with a mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;

      const response = await fetch("/api/web3/verify-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          transactionHash: mockTxHash,
          chainId: 1, // Mainnet
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`${role} verification completed successfully!`);
        fetchVerificationStatus();
      } else {
        setMessage(result.error || `Failed to verify ${role} role`);
      }
    } catch (error) {
      setMessage(`An error occurred during ${role} verification`);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <h1>Xác thực tài khoản</h1>
          <p>Vui lòng đăng nhập để tiếp tục quá trình xác thực.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h1>Xác thực tài khoản AgriChain</h1>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1. KYC</div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2. Ví</div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              3. Vai trò
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`message ${message.includes("successfully") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        {/* Step 1: KYC Verification */}
        {step === 1 && (
          <div className="kyc-form">
            <h2>Xác thực danh tính (KYC)</h2>
            <form onSubmit={handleKYCSubmit}>
              <div className="form-section">
                <h3>Thông tin cá nhân</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={kycData.fullName || ""}
                      onChange={(e) =>
                        setKycData({ ...kycData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày sinh *</label>
                    <input
                      type="date"
                      required
                      value={kycData.dateOfBirth || ""}
                      onChange={(e) =>
                        setKycData({ ...kycData, dateOfBirth: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quốc tịch *</label>
                    <input
                      type="text"
                      required
                      value={kycData.nationality || ""}
                      onChange={(e) =>
                        setKycData({ ...kycData, nationality: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Loại giấy tờ *</label>
                    <select
                      required
                      value={kycData.governmentIdType || ""}
                      onChange={(e) =>
                        setKycData({
                          ...kycData,
                          governmentIdType: e.target.value as any,
                        })
                      }
                    >
                      <option value="">Chọn loại giấy tờ</option>
                      <option value="national_id">CMND/CCCD</option>
                      <option value="passport">Hộ chiếu</option>
                      <option value="driver_license">Bằng lái xe</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Số giấy tờ *</label>
                  <input
                    type="text"
                    required
                    value={kycData.governmentId || ""}
                    onChange={(e) =>
                      setKycData({ ...kycData, governmentId: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Địa chỉ</h3>
                <div className="form-group">
                  <label>Địa chỉ *</label>
                  <input
                    type="text"
                    required
                    value={kycData.streetAddress || ""}
                    onChange={(e) =>
                      setKycData({ ...kycData, streetAddress: e.target.value })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thành phố *</label>
                    <input
                      type="text"
                      required
                      value={kycData.city || ""}
                      onChange={(e) =>
                        setKycData({ ...kycData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Tỉnh/Thành *</label>
                    <input
                      type="text"
                      required
                      value={kycData.state || ""}
                      onChange={(e) =>
                        setKycData({ ...kycData, state: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mã bưu điện *</label>
                    <input
                      type="text"
                      required
                      value={kycData.postalCode || ""}
                      onChange={(e) =>
                        setKycData({ ...kycData, postalCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Quốc gia *</label>
                    <input
                      type="text"
                      required
                      value={kycData.country || ""}
                      onChange={(e) =>
                        setKycData({ ...kycData, country: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Tài liệu xác thực</h3>
                <div className="form-group">
                  <label>URL ảnh giấy tờ tùy thân *</label>
                  <input
                    type="url"
                    required
                    value={kycData.idDocumentUrl || ""}
                    onChange={(e) =>
                      setKycData({ ...kycData, idDocumentUrl: e.target.value })
                    }
                    placeholder="https://example.com/id-document.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>URL giấy tờ chứng minh địa chỉ *</label>
                  <input
                    type="url"
                    required
                    value={kycData.proofOfAddressUrl || ""}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        proofOfAddressUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com/address-proof.jpg"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Đang gửi..." : "Gửi KYC"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Wallet Verification */}
        {step === 2 && (
          <div className="wallet-verification">
            <h2>Xác thực ví điện tử</h2>
            <p>Kết nối và xác thực ví điện tử của bạn để tiếp tục.</p>

            {verificationData?.kycStatus !== "APPROVED" && (
              <div className="warning">
                ⚠️ Bạn cần hoàn thành KYC trước khi xác thực ví.
              </div>
            )}

            {isConnected && address ? (
              <div className="wallet-info">
                <p>
                  <strong>Ví đã kết nối:</strong> {address}
                </p>
                <Button
                  onClick={handleWalletVerification}
                  disabled={
                    loading || verificationData?.kycStatus !== "APPROVED"
                  }
                  className="verify-btn"
                >
                  {loading ? "Đang xác thực..." : "Xác thực ví"}
                </Button>
              </div>
            ) : (
              <div className="wallet-connect-prompt">
                <p>Vui lòng kết nối ví từ header để tiếp tục.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Role Verification */}
        {step === 3 && (
          <div className="role-verification">
            <h2>Xác thực vai trò</h2>
            <p>Chọn vai trò của bạn trong hệ thống AgriChain.</p>

            <div className="role-options">
              <div className="role-card">
                <h3>🌾 Nông dân</h3>
                <p>Bán sản phẩm nông nghiệp và nhận NFT chứng thực.</p>
                {verificationData?.farmerVerified ? (
                  <div className="verified">✅ Đã xác thực</div>
                ) : (
                  <Button
                    onClick={() => handleRoleVerification("farmer")}
                    disabled={loading || !verificationData?.canVerifyFarmer}
                    className="role-btn farmer-btn"
                  >
                    {loading ? "Đang xác thực..." : "Xác thực làm nông dân"}
                  </Button>
                )}
              </div>

              <div className="role-card">
                <h3>🛒 Người mua</h3>
                <p>Mua sản phẩm và nhận token thưởng.</p>
                {verificationData?.buyerVerified ? (
                  <div className="verified">✅ Đã xác thực</div>
                ) : (
                  <Button
                    onClick={() => handleRoleVerification("buyer")}
                    disabled={loading || !verificationData?.canVerifyBuyer}
                    className="role-btn buyer-btn"
                  >
                    {loading ? "Đang xác thực..." : "Xác thực làm người mua"}
                  </Button>
                )}
              </div>
            </div>

            {verificationData?.farmerVerified &&
              verificationData?.buyerVerified && (
                <div className="completion-message">
                  🎉 Chúc mừng! Bạn đã hoàn thành tất cả các bước xác thực.
                </div>
              )}
          </div>
        )}

        {/* Verification Status Summary */}
        {verificationData && (
          <div className="status-summary">
            <h3>Trạng thái xác thực</h3>
            <div className="status-grid">
              <div
                className={`status-item ${verificationData.kycStatus === "APPROVED" ? "completed" : "pending"}`}
              >
                <span>KYC:</span>
                <span>
                  {verificationData.kycStatus === "APPROVED"
                    ? "✅ Đã duyệt"
                    : "⏳ Chờ duyệt"}
                </span>
              </div>
              <div
                className={`status-item ${verificationData.walletVerified ? "completed" : "pending"}`}
              >
                <span>Ví:</span>
                <span>
                  {verificationData.walletVerified
                    ? "✅ Đã xác thực"
                    : "⏳ Chưa xác thực"}
                </span>
              </div>
              <div
                className={`status-item ${verificationData.farmerVerified ? "completed" : "pending"}`}
              >
                <span>Nông dân:</span>
                <span>
                  {verificationData.farmerVerified
                    ? "✅ Đã xác thực"
                    : "⏳ Chưa xác thực"}
                </span>
              </div>
              <div
                className={`status-item ${verificationData.buyerVerified ? "completed" : "pending"}`}
              >
                <span>Người mua:</span>
                <span>
                  {verificationData.buyerVerified
                    ? "✅ Đã xác thực"
                    : "⏳ Chưa xác thực"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
