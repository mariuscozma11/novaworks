import { NextRequest, NextResponse } from 'next/server';
import { uploadProductImage, deleteImage } from '@/lib/storage';
import { db } from '@/lib/db';
import { productImages } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Use Node runtime for postgres compatibility
export const runtime = 'nodejs';

/**
 * POST /api/products/[productId]/images
 * Upload a new product image
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const formData = await request.formData();

    const file = formData.get('file') as File;
    const altText = formData.get('altText') as string;
    const displayOrder = formData.get('displayOrder') as string;
    const isPrimary = formData.get('isPrimary') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const url = await uploadProductImage(file, productId);

    // Save to database
    const [image] = await db
      .insert(productImages)
      .values({
        productId,
        url,
        altText: altText || file.name,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isPrimary,
      })
      .returning();

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
        success: false
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products/[productId]/images
 * Get all images for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const images = await db.query.productImages.findMany({
      where: eq(productImages.productId, productId),
      orderBy: (images, { asc }) => [asc(images.displayOrder)],
    });

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch images',
        success: false
      },
      { status: 500 }
    );
  }
}
