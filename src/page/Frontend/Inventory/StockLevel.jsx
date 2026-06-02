import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./StockLevels.css";
import usePagination from "../../../hook/usePagination";
import { getProducts } from "../../../services/api";

function StockLevel() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // ================= LOAD PRODUCTS =================
const fetchProducts = async () => {
  try {
    setLoading(true);

    const response = await getProducts();

    console.log(response);

    // FIX HERE
    const formattedProducts = (response.data || []).map((item) => ({
      id: item.prd_id,
      code: item.prd_code,
      name: item.name,
      category: item.cat_id || "General",
      stock: Number(item.qty),
      minStock: 10,
      price: Number(item.price),
    }));

    setProducts(formattedProducts);

  } catch (error) {
    console.error("Failed to load products:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= STOCK STATUS =================
  const getStockStatus = (stock, minStock) => {
    if (stock <= 0) {
      return {
        label: "Out of Stock",
        className: "status-red",
      };
    }

    if (stock <= minStock) {
      return {
        label: "Low Stock",
        className: "status-yellow",
      };
    }

    return {
      label: "In Stock",
      className: "status-green",
    };
  };

  // ================= FILTER PRODUCTS =================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase()) ||
        String(product.category)
          .toLowerCase()
          .includes(search.toLowerCase());

      const isLowStock = product.stock <= product.minStock;

      if (filter === "low") {
        return matchSearch && isLowStock;
      }

      if (filter === "normal") {
        return matchSearch && !isLowStock;
      }

      return matchSearch;
    });
  }, [products, search, filter]);

  // ================= SUMMARY =================
  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (item) => item.stock <= item.minStock
  ).length;

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );

  return (
    <div className="stock-container">
      <Sidebar />

      <div className="stock-wrapper">
        {/* HEADER */}
        <div className="header">
          <div>
            <h1>Stock Level Management</h1>
            <p>Monitor product inventory and stock availability.</p>
          </div>

          <button className="refresh-btn" onClick={fetchProducts}>
            🔄 Refresh
          </button>
        </div>

        {/* SUMMARY */}
        <div className="summary-grid">
          <div className="card">
            <div className="card-content">
              <div>
                <p>Total Products</p>
                <h2>{totalProducts}</h2>
              </div>

              <div className="icon">📦</div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div>
                <p>Low Stock Items</p>
                <h2 className="yellow">{lowStockProducts}</h2>
              </div>

              <div className="icon">⚠️</div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div>
                <p>Total Stock Qty</p>
                <h2 className="green">{totalStock}</h2>
              </div>

              <div className="icon">📈</div>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="card filter-box">
          <div className="filter-row">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Products</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal Stock</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th className="center">Stock</th>
                  <th className="center">Minimum</th>
                  <th className="center">Price</th>
                  <th className="center">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const status = getStockStatus(
                      product.stock,
                      product.minStock
                    );

                    return (
                      <tr key={product.id}>
                        <td>{product.code}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>

                        <td className="center bold">
                          {product.stock}
                        </td>

                        <td className="center">
                          {product.minStock}
                        </td>

                        <td className="center">
                          ${product.price.toFixed(2)}
                        </td>

                        <td className="center">
                          <span className={`status ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="empty">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockLevel;