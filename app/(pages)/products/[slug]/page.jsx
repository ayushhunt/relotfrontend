// app/products/[id]/page.jsx
import { Metadata } from 'next';
import ProductDetails from '../../../components/Product/ProductDetails';
import RelatedProducts from '../../../components/Product/RelatedProduct';
import ProductReviews from '../../../components/Product/ProductReview';
import AddReview from '../../../components/Product/AddReview'
import { getProductById} from '../../../lib/products/products'

//Generate metadata for SEO
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
  const productData = await getProductById(resolvedParams.slug);
  const product = productData.data;
  return {
    title: `${product.name} | YourStore`,
    description: product.description,
    openGraph: {
      title: `${product.name} | YourStore`,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      }
    }
  };
}

export default async function ProductPage({ params }) {
  // Fetch product data
  const resolvedParams = await params;
  const productData = await getProductById(resolvedParams.slug);
  const product = productData.data;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Product Details Component */}
        <ProductDetails product={product} />
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <RelatedProducts productId={product.id} category={product.category} />
        </div>
        
        {/* Product Reviews */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ProductReviews productId={product.id} />
        </div>
        
        {/* Add Review Form */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold mb-4">Write a Review</h2>
          <AddReview productId={product.id} />
        </div>
      </div>
    </div>
  );
}