import { NextRequest, NextResponse } from 'next/server';
import { uploadCategoryImage, deleteImage } from '@/lib/storage';
import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Use Node runtime for postgres compatibility
export const runtime = 'nodejs';

/**
 * POST /api/categories/[categoryId]/image
 * Upload a category image
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const formData = await request.formData();

    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const url = await uploadCategoryImage(file, categoryId);

    // Update category with image URL
    const [category] = await db
      .update(categories)
      .set({ imageUrl: url })
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json({
      success: true,
      url,
      category,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[categoryId]/image
 * Delete category image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    // Get current image URL
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!category?.imageUrl) {
      return NextResponse.json(
        { error: 'No image to delete' },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    await deleteImage(category.imageUrl);

    // Clear image URL from database
    await db
      .update(categories)
      .set({ imageUrl: null })
      .where(eq(categories.id, categoryId));

    return NextResponse.json({
      success: true,
      message: 'Image deleted',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Delete failed',
        success: false,
      },
      { status: 500 }
    );
  }
}
