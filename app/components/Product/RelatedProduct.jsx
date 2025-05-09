// components/product/RelatedProducts.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getRelatedProducts } from '../../lib/products/products';

export default function RelatedProducts({ productId, category }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await getRelatedProducts(productId, category);
        if (response.success && response.data) {
          setRelatedProducts(response.data.slice(0, 4)); // Limit to 4 products
        }
      } catch (error) {
        console.error('Failed to fetch related products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, category]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-4 h-64"></div>
        ))}
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return <p className="text-gray-500">No related products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">No image</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg truncate">{product.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i}
                    size={14}
                    className={i < Math.round(product.ratings || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <div className="mt-2 font-bold text-blue-600">${product.price.toFixed(2)}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}