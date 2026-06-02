import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./ListProduct.css";
import "./AddjustProduct.css";
import usePagination from "../../../hook/usePagination";

import {
  deleteProduct,
  getProducts,
  searchProducts,
  adjustProduct,
} from "../../../services/api";

const AdjustProduct = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // STORE TEMP QTY CHANGE
  const [adjustQty, setAdjustQty] = useState({});

  // ============================================
  // PAGINATION
  // ============================================
  const {
    paginatedItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    resetPage,
  } = usePagination(products);

  // ============================================
  // LOAD PRODUCTS
  // ============================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ============================================
  // SEARCH FROM BACKEND
  // ============================================
  const handleSearch = async (value) => {
    setSearch(value);
    resetPage();

    if (!value) {
      fetchProducts();
      return;
    }

    try {
      const res = await searchProducts(value);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  // ============================================
  // HANDLE QTY CHANGE
  // ============================================
  const handleQtyChange = (id, value) => {
    setAdjustQty((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const increaseQty = (id) => {
    setAdjustQty((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setAdjustQty((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) - 1,
    }));
  };

  // ============================================
  // SAVE ADJUSTMENT
  // ============================================
  const handleSave = async (product) => {
    const qty = adjustQty[product.prd_id];

    if (!qty || qty === 0) {
      alert("No adjustment");
      return;
    }

    try {
      await adjustProduct({
        prd_id: product.prd_id,
        qty: qty,
      });

      alert("Adjusted successfully");

      setAdjustQty({});
      fetchProducts();
    } catch (err) {
      alert("Adjustment failed");
    }
  };

  const handleSaveAll = async () => {
    const changes = Object.entries(adjustQty).filter(([, qty]) => qty !== 0 && qty !== undefined && qty !== null);

    if (changes.length === 0) {
      alert("No adjustment");
      return;
    }

    try {
      await Promise.all(
        changes.map(async ([id, qty]) => {
          const product = products.find((p) => String(p.prd_id) === String(id));
          if (!product) {
            throw new Error(`Product not found for id ${id}`);
          }

          await adjustProduct({
            prd_id: product.prd_id,
            qty,
          });
        })
      );

      alert("All adjustments saved successfully");
      setAdjustQty({});
      fetchProducts();
    } catch (err) {
      console.error("Save all adjustments failed", err);
      alert("Failed to save all adjustments");
    }
  };

  // ============================================
  // DELETE
  // ============================================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="page-title">
          <div>
            <h2>Product Adjustments</h2>
            <p>Search by ID, Code, Name</p>
          </div>
        </div>

        <input
          className=" adjustsearch-input"
          placeholder="Search product by ID, Code, Name"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* //Save adjustment for each product */}
        <button
          className="btn-save-all"
          onClick={handleSaveAll}
        >
          Save All Adjustments
        </button>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Adjust</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedItems.map((p) => (
                  <tr key={p.prd_id}>
                    <td>{p.prd_id}</td>
                    <td>{p.prd_code}</td>
                    <td>{p.name}</td>
                    <td>{p.qty}</td>

                    {/* ADJUST UI */}
                    <td>
                      <div className="qty-control">
                        <button onClick={() => decreaseQty(p.prd_id)}>
                          -
                        </button>

                        <input
                          type="number"
                          value={adjustQty[p.prd_id] || 0}
                          onChange={(e) =>
                            handleQtyChange(p.prd_id, e.target.value)
                          }
                        />

                        <button onClick={() => increaseQty(p.prd_id)}>
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      <button
                        className="btn-save btn-delete"
                        onClick={() => handleSave(p)}
                      >
                        Save
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(p.prd_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
          </>
        )}
      </div>
    </div>
  );
};

export default AdjustProduct;