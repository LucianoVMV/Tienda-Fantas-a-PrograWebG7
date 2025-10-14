import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useData } from '../context/DataContext'; 
import './SearchResults.css';

const ITEMS_PER_PAGE = 8; 

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const categoryQuery = searchParams.get('category');

  
  const { products, categories } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryQuery || '');
  const [sortOrder, setSortOrder] = useState<string>('name-asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  
  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    }
  }, [categoryQuery]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => p.isActive !== false);

    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        (p.category && p.category.toLowerCase().includes(lowerQuery))
      );
    } else if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    result.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [query, products, selectedCategory, sortOrder]);
  
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="search-results-page">
      <h1 className="search-title">
        {query ? `Resultados para: "${query}"` : selectedCategory ? `Categoría: "${selectedCategory}"` : 'Todos los Productos'}
      </h1>
      <div className="search-layout">
        <aside className="search-filters">
          <h3>Categorías</h3>
          <button onClick={() => setSelectedCategory('')} className={!selectedCategory ? 'active' : ''}>Todas</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={selectedCategory === cat.name ? 'active' : ''}>
              {cat.name}
            </button>
          ))}
          <hr />
          <h3>Ordenar por</h3>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="price-asc">Precio (Menor a Mayor)</option>
            <option value="price-desc">Precio (Mayor a Menor)</option>
          </select>
        </aside>

        <main className="search-products">
          <div className="product-grid">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(p => <ProductCard key={p.id} p={p} />)
            ) : (
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Siguiente</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};