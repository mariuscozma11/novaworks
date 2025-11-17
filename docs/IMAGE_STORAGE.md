# Image Storage with Vercel Blob

This project uses Vercel Blob for storing images. Images are uploaded to Vercel's CDN and the URLs are stored in the database.

## Architecture

```
Client Upload → API Route → Vercel Blob → Get URL → Save to Database
```

## Setup

1. **Environment Variables**
   ```env
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

2. **Storage Structure**
   ```
   vercel-blob/
   ├── products/
   │   └── {productId}/
   │       ├── 1699123456789.jpg
   │       ├── 1699123457890.png
   │       └── 1699123458901.webp
   └── categories/
       └── {categoryId}/
           └── 1699123456789.jpg
   ```

## Product Images

### Upload Product Image

```typescript
// POST /api/products/{productId}/images
const formData = new FormData();
formData.append('file', file);
formData.append('altText', 'Dragon statue front view');
formData.append('displayOrder', '0');
formData.append('isPrimary', 'true');

const response = await fetch(`/api/products/${productId}/images`, {
  method: 'POST',
  body: formData,
});

const data = await response.json();
// Returns: { success: true, image: { id, url, altText, ... } }
```

### Get All Product Images

```typescript
// GET /api/products/{productId}/images
const response = await fetch(`/api/products/${productId}/images`);
const data = await response.json();
// Returns: { success: true, images: [...] }
```

### Direct Upload (Server-side)

```typescript
import { uploadProductImage } from '@/lib/storage';

const url = await uploadProductImage(file, productId);

await db.insert(productImages).values({
  productId,
  url,
  altText: 'Product image',
  displayOrder: 0,
  isPrimary: true,
});
```

## Category Images

### Upload Category Image

```typescript
// POST /api/categories/{categoryId}/image
const formData = new FormData();
formData.append('file', file);

const response = await fetch(`/api/categories/${categoryId}/image`, {
  method: 'POST',
  body: formData,
});

const data = await response.json();
// Returns: { success: true, url, category }
```

### Delete Category Image

```typescript
// DELETE /api/categories/{categoryId}/image
const response = await fetch(`/api/categories/${categoryId}/image`, {
  method: 'DELETE',
});
```

### Direct Upload (Server-side)

```typescript
import { uploadCategoryImage } from '@/lib/storage';

const url = await uploadCategoryImage(file, categoryId);

await db.update(categories)
  .set({ imageUrl: url })
  .where(eq(categories.id, categoryId));
```

## File Constraints

- **Allowed types**: JPEG, PNG, WebP, GIF
- **Max size**: 5MB per file
- **Naming**: Automatic timestamp-based naming
- **Organization**: Separate folders for products and categories

## Available Functions

### Product Images
```typescript
uploadProductImage(file: File, productId: string): Promise<string>
uploadMultipleProductImages(files: File[], productId: string): Promise<string[]>
listProductImages(productId: string): Promise<ListBlobResult>
```

### Category Images
```typescript
uploadCategoryImage(file: File, categoryId: string): Promise<string>
listCategoryImages(categoryId: string): Promise<ListBlobResult>
```

### Generic
```typescript
deleteImage(url: string): Promise<void>
```

## Database Schema

### Product Images
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(200),
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);
```

### Category Images
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),  -- Single image per category
  ...
);
```

## Cost Estimation

Vercel Blob pricing:
- **Free tier**: 500MB storage, 1GB bandwidth/month
- **Pro**: $0.025/GB storage, $0.15/GB bandwidth
- For 1000 products with 5 images each (500KB avg):
  - Storage: 2.5GB = ~$0.06/month
  - Bandwidth (10k views): 25GB = ~$3.75/month

## Best Practices

1. **Optimize images before upload** (client-side compression)
2. **Use WebP format** for better compression
3. **Set proper alt text** for SEO and accessibility
4. **Use display_order** to control image sequence
5. **Mark one image as primary** for thumbnails
6. **Delete from Blob when deleting from DB** to avoid orphaned files
