import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageOpen } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <PackageOpen className="h-24 w-24 mx-auto text-muted-foreground" />
        <h1 className="text-4xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/en/products">Browse Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/en">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
