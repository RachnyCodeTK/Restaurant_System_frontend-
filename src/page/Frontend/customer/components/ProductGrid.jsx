import React, { useState, useEffect } from "react";
import { getProducts, getCategories } from "../../../../services/api";
import { getImageUrl } from "../../../../utils/imageUtils";
import usePagination from "../../../../hook/usePagination";

const ProductGrid = ({ addToCart, selectedCategory = null, onCategoryChange }) => {
  const [filterCategory, setFilterCategory] = useState(selectedCategory || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        setProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products and categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === "all" || product.cat_id === parseInt(filterCategory);
    const productName = (product.name || product.prd_name || '').toString();
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const {
    paginatedItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    resetPage,
  } = usePagination(filteredProducts);

  const handleFilterChange = (category) => {
    setFilterCategory(category);
    resetPage();
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  if (loading) {
    return (
      <section className="product-grid-section" id="products">
        <div className="section-header">
          <h2>Shop by Collection</h2>
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-grid-section" id="products">
        <div className="section-header">
          <h2>Shop by Collection</h2>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </section>
    );
  }

  

  return (
    <section className="product-grid-section" id="products">
      <div className="section-header">
        <h2>Shop by Collection</h2>
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterCategory === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          {categories.map(category => (
            <button 
              key={category.cat_id}
              className={`filter-tab ${filterCategory === category.cat_id.toString() ? "active" : ""}`}
              onClick={() => handleFilterChange(category.cat_id.toString())}
            >
              {category.cat_name}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((product) => (
            <div key={product.prd_id} className="product-card">
              <div className="product-image">
                {(product.photo || product.prd_photo) ? (
                  <img
                    src={getImageUrl(product.photo || product.prd_photo)}
                    alt={product.name || product.prd_name}
                  />
                ) : (
                  <span className="product-emoji">🍽️</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name || product.prd_name}</h3>
                <p className="product-description">Delicious food item</p>
                <div className="product-rating">
                  ⭐ 4.5 (120 reviews)
                </div>
                <div className="product-footer">
                  <span className="price">${product.price || product.prd_price}</span>
                  <button 
                    className="add-btn"
                    onClick={() => addToCart({
                      id: product.prd_id || product.id,
                      name: product.name || product.prd_name,
                      price: product.price || product.prd_price,
                      photo: getImageUrl(product.photo || product.prd_photo)
                    })}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999' }}>
            <p>No products found. Try a different category or search term.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
        <button
          onClick={goToPrevPage}
          disabled={!hasPrevPage}
          style={{
            padding: '10px 20px',
            cursor: hasPrevPage ? 'pointer' : 'not-allowed',
            opacity: hasPrevPage ? 1 : 0.5,
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          ← Previous
        </button>

        <span style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          style={{
            padding: '10px 20px',
            cursor: hasNextPage ? 'pointer' : 'not-allowed',
            opacity: hasNextPage ? 1 : 0.5,
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Next →
        </button>
      </div>
    </section>
  );
};

export default ProductGrid;
