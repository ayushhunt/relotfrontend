// pages/products.js
'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../page";

// const productsData = [
//   {
//     name: "T-Shirt",
//     category: "Women Cloths",
//     price: 79.8,
//     stock: 79,
//     status: "Scheduled",
//   },
//   {
//     name: "Shirt",
//     category: "Man Cloths",
//     price: 76.89,
//     stock: 86,
//     status: "Active",
//   }
// ];

const pageSize = 5;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsData, setProductsData] = useState([]);

  const totalPages = Math.ceil(productsData.length / pageSize);
  const currentProducts = productsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const getAllProducts = async () => {
      const response = await axios.get("http://localhost:3000/v1/products");
      console.log(response.data.data);
      setProductsData(response.data.data);
    };
    debugger;
    getAllProducts();
  }, []);

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((page, i) =>
      page === "..." ? (
        <span key={i} className="px-2 py-1 text-gray-500">
          ...
        </span>
      ) : (
        <span
          key={i}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? "bg-purple-600 text-white" : ""
          }`}
        >
          {page}
        </span>
      )
    );
  };

  return (
    <AdminLayout>
      <div className="bodyy">
        <div className="flex flex-col w-full justify-center h-full">
          <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Products List</h2>
            </header>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap text-left">
                        Product
                      </th>
                      <th className="p-2 whitespace-nowrap text-left">
                        Category
                      </th>
                      <th className="p-2 whitespace-nowrap text-left">Price</th>
                      <th className="p-2 whitespace-nowrap text-left">Stock</th>
                      <th className="p-2 whitespace-nowrap text-left">
                        Status
                      </th>
                      <th className="p-2 whitespace-nowrap text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                              <img
                                className="rounded"
                                src={product.image}
                                width="40"
                                height="40"
                                alt={product.name}
                              />
                            </div>
                            <div className="font-medium text-gray-800">
                              {product.name}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {product.category}
                        </td>
                        <td className="p-2 whitespace-nowrap text-green-500 font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {product.stock}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <span
                            className={`text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                              product.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : product.status === "Draft"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <button className="text-purple-600 hover:underline">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 px-5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {/* {renderPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-3 py-1 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  page === currentPage
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )} */}
            {renderPageNumbers()}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
