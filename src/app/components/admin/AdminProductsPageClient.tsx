'use client';

import { useState, useMemo } from 'react';
import { ProductEntrySkeleton } from '../../types/product';
import { Entry } from 'contentful';
import Link from 'next/link';

export default function AdminProductsPageClient({ products }: { products: Entry<ProductEntrySkeleton>[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('Alla');

  const productsPerPage = 5;

  const categories = useMemo(() => {
    const allCategories = products.map(p => p.fields.category).filter(Boolean);
    return ['Alla', ...Array.from(new Set(allCategories))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Alla') return products;
    return products.filter(product => product.fields.category === selectedCategory);
  }, [products, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Produkter</h1>
        <Link href="/admin/products/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          + Ny produkt
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          className="border rounded px-4 py-2"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Produktlista */}
      <div className="grid gap-4">
        {currentProducts.map((product) => (
          <div key={product.sys.id} className="bg-white shadow p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{product.fields.name}</h2>
            <p className="text-sm text-gray-600">{product.fields.description}</p>
            <p className="text-sm font-medium text-gray-800">{product.fields.price} kr</p>

            {product.fields.image && (
              <img
                src={`https:${product.fields.image.fields.file.url}`}
                alt={product.fields.name}
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}

            <Link
              href={`/admin/products/${product.sys.id}/edit`}
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Redigera
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Föregående
        </button>
        <span className="flex items-center">{currentPage} / {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Nästa
        </button>
      </div>
    </>
  );
}
