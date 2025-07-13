"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parseEther, formatEther } from "viem";
import {
  AGRICHAIN_TOKEN_ADDRESS,
  AGRICHAIN_NFT_ADDRESS,
  AGRICHAIN_MARKETPLACE_ADDRESS,
} from "@/lib/web3Config";
import {
  AGRICHAIN_TOKEN_ABI,
  AGRICHAIN_NFT_ABI,
  AGRICHAIN_MARKETPLACE_ABI,
  ProductCertification,
  QualityMetrics,
  Listing,
  Order,
  formatTokenAmount,
  parseTokenAmount,
} from "@/lib/contracts";

// Token Hooks
export function useTokenBalance() {
  const { address, chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_TOKEN_ADDRESS[chainId as keyof typeof AGRICHAIN_TOKEN_ADDRESS]
      : undefined,
    abi: AGRICHAIN_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!chainId,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });
}

export function useTokenAllowance(spender: string) {
  const { address, chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_TOKEN_ADDRESS[chainId as keyof typeof AGRICHAIN_TOKEN_ADDRESS]
      : undefined,
    abi: AGRICHAIN_TOKEN_ABI,
    functionName: "allowance",
    args: address && spender ? [address, spender] : undefined,
    query: {
      enabled: !!address && !!spender && !!chainId,
    },
  });
}

export function useApproveToken() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = useMutation({
    mutationFn: async ({
      spender,
      amount,
      chainId,
    }: {
      spender: string;
      amount: string;
      chainId: number;
    }) => {
      const tokenAddress =
        AGRICHAIN_TOKEN_ADDRESS[
          chainId as keyof typeof AGRICHAIN_TOKEN_ADDRESS
        ];
      if (!tokenAddress) throw new Error("Unsupported chain");

      writeContract({
        address: tokenAddress,
        abi: AGRICHAIN_TOKEN_ABI,
        functionName: "approve",
        args: [spender, parseTokenAmount(amount)],
      });
    },
    onSuccess: () => {
      // Invalidate and refetch allowance queries
      queryClient.invalidateQueries({ queryKey: ["tokenAllowance"] });
    },
  });

  return {
    approve: approve.mutate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Verification Hooks
export function useVerificationStatus() {
  const { address, chainId } = useAccount();

  const { data: isFarmer } = useReadContract({
    address: chainId
      ? AGRICHAIN_TOKEN_ADDRESS[chainId as keyof typeof AGRICHAIN_TOKEN_ADDRESS]
      : undefined,
    abi: AGRICHAIN_TOKEN_ABI,
    functionName: "verifiedFarmers",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  const { data: isBuyer } = useReadContract({
    address: chainId
      ? AGRICHAIN_TOKEN_ADDRESS[chainId as keyof typeof AGRICHAIN_TOKEN_ADDRESS]
      : undefined,
    abi: AGRICHAIN_TOKEN_ABI,
    functionName: "verifiedBuyers",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  return {
    isFarmer: !!isFarmer,
    isBuyer: !!isBuyer,
    isVerified: !!isFarmer || !!isBuyer,
  };
}

// NFT Hooks
export function useNFTBalance(tokenId: number) {
  const { address, chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_NFT_ADDRESS[chainId as keyof typeof AGRICHAIN_NFT_ADDRESS]
      : undefined,
    abi: AGRICHAIN_NFT_ABI,
    functionName: "balanceOf",
    args: address && tokenId ? [address, BigInt(tokenId)] : undefined,
    query: {
      enabled: !!address && !!chainId && tokenId !== undefined,
    },
  });
}

export function useProductCertification(tokenId: number) {
  const { chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_NFT_ADDRESS[chainId as keyof typeof AGRICHAIN_NFT_ADDRESS]
      : undefined,
    abi: AGRICHAIN_NFT_ABI,
    functionName: "getProductCertification",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!chainId && tokenId !== undefined,
    },
  });
}

export function useQualityMetrics(tokenId: number) {
  const { chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_NFT_ADDRESS[chainId as keyof typeof AGRICHAIN_NFT_ADDRESS]
      : undefined,
    abi: AGRICHAIN_NFT_ABI,
    functionName: "getQualityMetrics",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!chainId && tokenId !== undefined,
    },
  });
}

// Marketplace Hooks
export function useCreateListing() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createListing = useMutation({
    mutationFn: async ({
      nftTokenId,
      quantity,
      pricePerUnit,
      pricePerUnitETH,
      acceptsETH,
      acceptsAGRI,
      duration,
      chainId,
    }: {
      nftTokenId: number;
      quantity: number;
      pricePerUnit: string;
      pricePerUnitETH: string;
      acceptsETH: boolean;
      acceptsAGRI: boolean;
      duration: number;
      chainId: number;
    }) => {
      const marketplaceAddress =
        AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ];
      if (!marketplaceAddress) throw new Error("Unsupported chain");

      writeContract({
        address: marketplaceAddress,
        abi: AGRICHAIN_MARKETPLACE_ABI,
        functionName: "createListing",
        args: [
          BigInt(nftTokenId),
          BigInt(quantity),
          parseTokenAmount(pricePerUnit),
          parseEther(pricePerUnitETH),
          acceptsETH,
          acceptsAGRI,
          BigInt(duration),
        ],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  return {
    createListing: createListing.mutate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createOrder = useMutation({
    mutationFn: async ({
      listingId,
      quantity,
      payWithETH,
      shippingAddress,
      ethValue,
      chainId,
    }: {
      listingId: number;
      quantity: number;
      payWithETH: boolean;
      shippingAddress: string;
      ethValue?: string;
      chainId: number;
    }) => {
      const marketplaceAddress =
        AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ];
      if (!marketplaceAddress) throw new Error("Unsupported chain");

      writeContract({
        address: marketplaceAddress,
        abi: AGRICHAIN_MARKETPLACE_ABI,
        functionName: "createOrder",
        args: [
          BigInt(listingId),
          BigInt(quantity),
          payWithETH,
          shippingAddress,
        ],
        value: payWithETH && ethValue ? parseEther(ethValue) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  return {
    createOrder: createOrder.mutate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useListing(listingId: number) {
  const { chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ]
      : undefined,
    abi: AGRICHAIN_MARKETPLACE_ABI,
    functionName: "listings",
    args: listingId ? [BigInt(listingId)] : undefined,
    query: {
      enabled: !!chainId && listingId !== undefined,
    },
  });
}

export function useOrder(orderId: number) {
  const { chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ]
      : undefined,
    abi: AGRICHAIN_MARKETPLACE_ABI,
    functionName: "orders",
    args: orderId ? [BigInt(orderId)] : undefined,
    query: {
      enabled: !!chainId && orderId !== undefined,
    },
  });
}

export function useSellerListings() {
  const { address, chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ]
      : undefined,
    abi: AGRICHAIN_MARKETPLACE_ABI,
    functionName: "getSellerListings",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!chainId,
    },
  });
}

export function useBuyerOrders() {
  const { address, chainId } = useAccount();

  return useReadContract({
    address: chainId
      ? AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ]
      : undefined,
    abi: AGRICHAIN_MARKETPLACE_ABI,
    functionName: "getBuyerOrders",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!chainId,
    },
  });
}

// Order Management Hooks
export function useConfirmOrder() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const confirmOrder = useMutation({
    mutationFn: async ({
      orderId,
      chainId,
    }: {
      orderId: number;
      chainId: number;
    }) => {
      const marketplaceAddress =
        AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ];
      if (!marketplaceAddress) throw new Error("Unsupported chain");

      writeContract({
        address: marketplaceAddress,
        abi: AGRICHAIN_MARKETPLACE_ABI,
        functionName: "confirmOrder",
        args: [BigInt(orderId)],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    confirmOrder: confirmOrder.mutate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useShipOrder() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const shipOrder = useMutation({
    mutationFn: async ({
      orderId,
      chainId,
    }: {
      orderId: number;
      chainId: number;
    }) => {
      const marketplaceAddress =
        AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ];
      if (!marketplaceAddress) throw new Error("Unsupported chain");

      writeContract({
        address: marketplaceAddress,
        abi: AGRICHAIN_MARKETPLACE_ABI,
        functionName: "shipOrder",
        args: [BigInt(orderId)],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    shipOrder: shipOrder.mutate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useDeliverOrder() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deliverOrder = useMutation({
    mutationFn: async ({
      orderId,
      chainId,
    }: {
      orderId: number;
      chainId: number;
    }) => {
      const marketplaceAddress =
        AGRICHAIN_MARKETPLACE_ADDRESS[
          chainId as keyof typeof AGRICHAIN_MARKETPLACE_ADDRESS
        ];
      if (!marketplaceAddress) throw new Error("Unsupported chain");

      writeContract({
        address: marketplaceAddress,
        abi: AGRICHAIN_MARKETPLACE_ABI,
        functionName: "deliverOrder",
        args: [BigInt(orderId)],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
    },
  });

  return {
    deliverOrder: deliverOrder.mutate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Utility functions
export function formatBalance(balance: bigint | undefined): string {
  if (!balance) return "0";
  return formatTokenAmount(balance);
}

export function formatPrice(price: bigint | undefined): string {
  if (!price) return "0";
  return formatEther(price);
}
