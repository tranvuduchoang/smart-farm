import { http, createConfig } from "wagmi";
import { base, mainnet, sepolia, polygon, polygonMumbai } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "default-project-id";

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai, base],
  connectors: [injected(), metaMask(), walletConnect({ projectId }), safe()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [base.id]: http(),
  },
});

export const AGRICHAIN_TOKEN_ADDRESS = {
  [mainnet.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [sepolia.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [polygon.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [polygonMumbai.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [base.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
};

export const AGRICHAIN_NFT_ADDRESS = {
  [mainnet.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [sepolia.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [polygon.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [polygonMumbai.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [base.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
};

export const AGRICHAIN_MARKETPLACE_ADDRESS = {
  [mainnet.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [sepolia.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [polygon.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [polygonMumbai.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [base.id]: "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
};

export const RPC_URLS = {
  [mainnet.id]: "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
  [sepolia.id]: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
  [polygon.id]: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
  [polygonMumbai.id]: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY",
  [base.id]: "https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
};
