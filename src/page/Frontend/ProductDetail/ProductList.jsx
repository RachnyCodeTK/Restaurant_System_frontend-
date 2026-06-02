import React, { useEffect, useState } from "react";
import axios from "axios";
import usePagination from "../../../hook/usePagination";
import { getImageUrl } from "../../../utils/imageUtils";

/**
 * 📦 Product List from Database
 */
const ProductList = ({ addToCart }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/product");

      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * 🔍 Barcode Scan
   */
  const handleScan = (e) => {
    const code = e.target.value;

    setSearch(code);

    const found = products.find(
      (p) => p.prd_code === code
    );

    // ✅ Product found and stock available
    if (found && found.qty > 0) {
      addToCart(found);
      setSearch("");
    }
  };

  // ================= FILTER SEARCH =================
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.prd_code.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="products">
      {/* SEARCH / BARCODE */}
      <input
        type="text"
        placeholder="🔍 Search or scan barcode..."
        value={search}
        onChange={(e) => {
          handleScan(e);
          resetPage();
        }}
      />

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {paginatedItems.map((p) => (
          <div
            key={p.prd_id}
            className={`product-card ${p.qty <= 0 ? "out-stock" : ""}`}
            onClick={() => {
              // ❌ BLOCK OUT OF STOCK
              if (p.qty <= 0) {
                alert("Out of stock");
                return;
              }

              addToCart(p);
            }}
          >
            {/* PRODUCT IMAGE */}
            <img
              src={getImageUrl(p.photo)}
              alt={p.name}
              className="product-image"
            />

            <h4>{p.name}</h4>

            <p>Code: {p.prd_code}</p>

            <p>Price: ${p.price}</p>

            {/* STOCK */}
            <p>
              Stock:
              <span
                style={{
                  color: p.qty <= 0 ? "red" : "green",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {p.qty}
              </span>
            </p>

            {/* OUT OF STOCK LABEL */}
            {p.qty <= 0 && (
              <div className="out-stock-label">
                OUT OF STOCK
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button
          onClick={goToPrevPage}
          disabled={!hasPrevPage}
          style={{
            padding: '8px 16px',
            cursor: hasPrevPage ? 'pointer' : 'not-allowed',
            opacity: hasPrevPage ? 1 : 0.5,
          }}
        >
          ← Previous
        </button>

        <span style={{ fontSize: '14px', color: '#666' }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          style={{
            padding: '8px 16px',
            cursor: hasNextPage ? 'pointer' : 'not-allowed',
            opacity: hasNextPage ? 1 : 0.5,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default ProductList;