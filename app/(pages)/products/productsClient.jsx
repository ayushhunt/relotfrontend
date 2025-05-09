'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Filters from '../../components/Filter';
import Pagination from '../../components/Pagination'; // Don't forget this


export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const getQueryParam = (param, defaultValue) => {
    return searchParams.get(param) || defaultValue;
  };

  const currentFilters = {
    category: getQueryParam('category', ''),
    minPrice: getQueryParam('minPrice', ''),
    maxPrice: getQueryParam('maxPrice', ''),
    sort: getQueryParam('sort', 'createdAt'),
    order: getQueryParam('order', 'desc'),
    page: parseInt(getQueryParam('page', '1')),
    limit: parseInt(getQueryParam('limit', '10')),
    search: getQueryParam('search', '')
  };

  const fetchProducts = async (filters) => {
    try {
      setLoading(true);
      const queryString = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const response = await fetch(`http://localhost:3000/v1/products`); //?${queryString}
      const result = await response.json();
      // Update to match backend response structure
      if (result.success) {
        setProducts(result.data);
        setTotalProducts(result.pagination.totalItems);
      } else {
        console.error('Error in API response:', result.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };
    const queryString = Object.entries(updatedFilters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    router.push(`/products?${queryString}`);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...currentFilters, page: newPage };
    const queryString = Object.entries(updatedFilters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    router.push(`/products?${queryString}`);
  };

  useEffect(() => {
    fetchProducts(currentFilters);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {currentFilters.category ? (
          <>
            {currentFilters.category}
            {currentFilters.search && ` - Search: "${currentFilters.search}"`}
          </>
        ) : currentFilters.search ? (
          <>Search Results: "{currentFilters.search}"</>
        ) : (
          'All Products'
        )}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <Filters currentFilters={currentFilters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <p className="text-gray-600 mb-2 sm:mb-0">
              Showing {products.length} of {totalProducts} products
            </p>
            <div className="flex items-center">
              <span className="mr-2">Sort By</span>
              <select
                className="border rounded-md px-2 py-1"
                value={`${currentFilters.sort}-${currentFilters.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  handleFilterChange({ sort, order });
                }}
              >
                <option value="popularity-desc">Popularity</option>
                <option value="price-asc">Price — Low to High</option>
                <option value="price-desc">Price — High to Low</option>
                <option value="createdAt-desc">Newest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(currentFilters.limit)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-8">
                <Pagination
                  currentPage={currentFilters.page}
                  totalPages={Math.ceil(totalProducts / currentFilters.limit)}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No products found</p>
              <button
                className="mt-4 text-blue-600 hover:underline"
                onClick={() =>
                  handleFilterChange({
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    search: '',
                    sort: 'createdAt',
                    order: 'desc'
                  })
                }
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
