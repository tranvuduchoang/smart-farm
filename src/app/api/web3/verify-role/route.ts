import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const verifyRoleSchema = z.object({
  role: z.enum(["farmer", "buyer"]),
  transactionHash: z.string().min(1, "Transaction hash is required"),
  chainId: z.number().min(1, "Chain ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role, transactionHash, chainId } = verifyRoleSchema.parse(body);

    // Check if user has completed KYC
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        kycDocument: true,
        blockchainProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.kycDocument || user.kycDocument.status !== "APPROVED") {
      return NextResponse.json(
        { error: "KYC verification required before role verification" },
        { status: 400 },
      );
    }

    if (!user.isWeb3Verified || !user.walletAddress) {
      return NextResponse.json(
        { error: "Wallet verification required before role verification" },
        { status: 400 },
      );
    }

    // Update blockchain profile with role verification
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (role === "farmer") {
      updateData.isFarmerVerified = true;
      // Update user role if not already a seller
      if (user.role === "NORMAL_USER") {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            role: "SELLER",
            farmerVerifiedAt: new Date(),
          },
        });
      }
    } else if (role === "buyer") {
      updateData.isBuyerVerified = true;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { buyerVerifiedAt: new Date() },
      });
    }

    await prisma.blockchainProfile.update({
      where: { userId: session.user.id },
      data: updateData,
    });

    // Create a transaction record for verification
    await prisma.systemConfig.upsert({
      where: { key: `verification_${role}_${session.user.id}` },
      update: {
        value: JSON.stringify({
          transactionHash,
          chainId,
          walletAddress: user.walletAddress,
          verifiedAt: new Date().toISOString(),
        }),
        updatedAt: new Date(),
      },
      create: {
        key: `verification_${role}_${session.user.id}`,
        value: JSON.stringify({
          transactionHash,
          chainId,
          walletAddress: user.walletAddress,
          verifiedAt: new Date().toISOString(),
        }),
        description: `${role} verification for user ${session.user.id}`,
      },
    });

    return NextResponse.json({
      message: `${role} verification completed successfully`,
      role,
      transactionHash,
      chainId,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Role verification error:", error);

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
      include: {
        blockchainProfile: true,
        kycDocument: {
          select: {
            status: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const verificationStatus = {
      kycStatus: user.kycDocument?.status || "PENDING",
      kycVerifiedAt: user.kycDocument?.verifiedAt,
      walletVerified: user.isWeb3Verified,
      walletAddress: user.walletAddress,
      farmerVerified: user.blockchainProfile?.isFarmerVerified || false,
      buyerVerified: user.blockchainProfile?.isBuyerVerified || false,
      farmerVerifiedAt: user.farmerVerifiedAt,
      buyerVerifiedAt: user.buyerVerifiedAt,
      canVerifyFarmer:
        user.kycDocument?.status === "APPROVED" &&
        user.isWeb3Verified &&
        !user.blockchainProfile?.isFarmerVerified,
      canVerifyBuyer:
        user.kycDocument?.status === "APPROVED" &&
        user.isWeb3Verified &&
        !user.blockchainProfile?.isBuyerVerified,
    };

    return NextResponse.json(verificationStatus);
  } catch (error) {
    console.error("Verification status fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
