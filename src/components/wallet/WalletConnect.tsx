"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button/button";
import { useState } from "react";
import "./WalletConnect.css";

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showConnectors, setShowConnectors] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className={`wallet-connected ${className}`}>
        <div className="wallet-info">
          <div className="wallet-address">
            <span className="address-text">{formatAddress(address)}</span>
            {chain && <span className="chain-badge">{chain.name}</span>}
          </div>
          <Button
            variant="outline"
            onClick={() => disconnect()}
            className="disconnect-btn"
          >
            Ngắt kết nối
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`wallet-connect ${className}`}>
      {!showConnectors ? (
        <Button
          onClick={() => setShowConnectors(true)}
          className="connect-wallet-btn"
          disabled={isPending}
        >
          {isPending ? "Đang kết nối..." : "Kết nối ví"}
        </Button>
      ) : (
        <div className="connector-modal">
          <div className="connector-modal-content">
            <div className="connector-header">
              <h3>Chọn ví để kết nối</h3>
              <button
                className="close-btn"
                onClick={() => setShowConnectors(false)}
              >
                ×
              </button>
            </div>
            <div className="connector-list">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setShowConnectors(false);
                  }}
                  disabled={isPending}
                  className="connector-item"
                >
                  <span>{connector.name}</span>
                  {isPending && <span className="loading">...</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
