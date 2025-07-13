import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const kycSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  nationality: z.string().min(2, "Nationality is required"),
  governmentId: z.string().min(5, "Government ID is required"),
  governmentIdType: z.enum(["passport", "driver_license", "national_id"]),

  // Address Information
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),

  // Business Information (optional)
  businessName: z.string().optional(),
  businessType: z.enum(["individual", "partnership", "corporation"]).optional(),
  businessRegistration: z.string().optional(),
  taxId: z.string().optional(),

  // Document URLs
  idDocumentUrl: z.string().url("Valid ID document URL is required"),
  proofOfAddressUrl: z.string().url("Valid proof of address URL is required"),
  businessDocumentUrl: z.string().url().optional(),
  farmCertificateUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = kycSchema.parse(body);

    // Check if user already has KYC document
    const existingKyc = await prisma.kYCDocument.findUnique({
      where: { userId: session.user.id },
    });

    if (existingKyc && existingKyc.status === "APPROVED") {
      return NextResponse.json(
        { error: "KYC already approved for this user" },
        { status: 400 },
      );
    }

    // Create or update KYC document
    const kycDocument = await prisma.kYCDocument.upsert({
      where: { userId: session.user.id },
      update: {
        ...validatedData,
        status: "PENDING",
        verifiedBy: null,
        verifiedAt: null,
        rejectionReason: null,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        ...validatedData,
        status: "PENDING",
      },
    });

    // Update user KYC status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { kycStatus: "PENDING" },
    });

    return NextResponse.json({
      message: "KYC document submitted successfully",
      kycId: kycDocument.id,
      status: kycDocument.status,
    });
  } catch (error) {
    console.error("KYC submission error:", error);

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

    const kycDocument = await prisma.kYCDocument.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        fullName: true,
        dateOfBirth: true,
        nationality: true,
        governmentIdType: true,
        streetAddress: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        businessName: true,
        businessType: true,
        verifiedAt: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!kycDocument) {
      return NextResponse.json(
        { error: "No KYC document found" },
        { status: 404 },
      );
    }

    return NextResponse.json(kycDocument);
  } catch (error) {
    console.error("KYC fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
