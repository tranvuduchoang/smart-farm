import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyMessage } from "viem";
import { z } from "zod";

const verifyWalletSchema = z.object({
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  signature: z.string().min(1, "Signature is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { walletAddress, signature, message } =
      verifyWalletSchema.parse(body);

    // Expected message format
    const expectedMessage = `AgriChain Wallet Verification\nUser ID: ${session.user.id}\nTimestamp: ${message.split("Timestamp: ")[1]}`;

    if (message !== expectedMessage) {
      return NextResponse.json(
        { error: "Invalid verification message" },
        { status: 400 },
      );
    }

    // Verify the signature
    const isValid = await verifyMessage({
      address: walletAddress as `0x${string}`,
      message: expectedMessage,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Check if wallet address is already used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        walletAddress: walletAddress,
        id: { not: session.user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Wallet address is already associated with another account" },
        { status: 400 },
      );
    }

    // Update user with wallet address
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        walletAddress: walletAddress,
        isWeb3Verified: true,
        web3VerifiedAt: new Date(),
      },
    });

    // Create or update blockchain profile
    await prisma.blockchainProfile.upsert({
      where: { userId: session.user.id },
      update: {
        primaryWalletAddress: walletAddress,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        primaryWalletAddress: walletAddress,
      },
    });

    return NextResponse.json({
      message: "Wallet verified successfully",
      walletAddress: walletAddress,
      isWeb3Verified: true,
    });
  } catch (error) {
    console.error("Wallet verification error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        walletAddress: true,
        isWeb3Verified: true,
        web3VerifiedAt: true,
        blockchainProfile: {
          select: {
            primaryWalletAddress: true,
            isFarmerVerified: true,
            isBuyerVerified: true,
            tokenBalance: true,
            totalRewardsEarned: true,
            reputationScore: true,
            totalTransactions: true,
            successfulDeliveries: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      walletAddress: user.walletAddress,
      isWeb3Verified: user.isWeb3Verified,
      web3VerifiedAt: user.web3VerifiedAt,
      blockchainProfile: user.blockchainProfile,
    });
  } catch (error) {
    console.error("Wallet info fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Generate verification message
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timestamp = Date.now();
    const message = `AgriChain Wallet Verification\nUser ID: ${session.user.id}\nTimestamp: ${timestamp}`;

    return NextResponse.json({
      message,
      timestamp,
    });
  } catch (error) {
    console.error("Message generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
