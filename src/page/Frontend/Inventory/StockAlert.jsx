import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./StockAlert.css";

import { getProducts } from "../../../services/api";

const ITEMS_PER_PAGE = 10;

const StockAlert = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await getProducts();

            const formattedProducts = (response.data || []).map((item) => ({
                id: item.prd_id,
                code: item.prd_code,
                name: item.name,
                stock: Number(item.qty),
                minStock: 10,
                price: Number(item.price),
            }));

            setProducts(formattedProducts);

        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD FIRST TIME =================
    useEffect(() => {
        fetchProducts();
    }, []);

    // ================= SEARCH FILTER =================
    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [products, search]);

    // ================= PAGINATION =================
    const totalPages = Math.ceil(
        filteredProducts.length / ITEMS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) * ITEMS_PER_PAGE;

    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );

    // ================= LOW STOCK =================
    const isLowStock = (product) =>
        product.stock <= product.minStock;

    const lowStockCount =
        products.filter((p) => isLowStock(p)).length;

    return (
        <div className="stock-container">
            <Sidebar />

            <div className="main">
                <Header />

                {/* TOP SUMMARY */}
                <div className="top-summary">
                    <div className="summary-card warning">
                        <h3>⚠ Low Stock Items</h3>
                        <p>{lowStockCount}</p>
                    </div>

                    <div className="summary-card primary">
                        <h3>📦 Total Products</h3>
                        <p>{products.length}</p>
                    </div>
                </div>

                {/* HEADER */}
                <div className="stock-header">
                    <h1>Stock Alert System</h1>

                    <button
                        className="refresh-btn"
                        onClick={fetchProducts}
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="search-box"
                />

                {/* TABLE */}
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th className="text-left">
                                Product Name
                            </th>
                            <th>Stock</th>
                            <th>Min Stock</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="empty">
                                    Loading products...
                                </td>
                            </tr>
                        ) : paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className={
                                        isLowStock(product)
                                            ? "low-stock"
                                            : ""
                                    }
                                >
                                    <td>{product.id}</td>

                                    <td>{product.code}</td>

                                    {/* FLOAT LEFT */}
                                    <td className="text-left">
                                        {product.name}
                                    </td>

                                    <td>{product.stock}</td>

                                    <td>{product.minStock}</td>

                                    <td>
                                        {isLowStock(product) ? (
                                            <span className="alert">
                                                ⚠ Low Stock
                                            </span>
                                        ) : (
                                            <span className="ok">
                                                OK
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((prev) => prev - 1)
                        }
                    >
                        ← Previous
                    </button>

                    <span>
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <button
                        disabled={
                            currentPage === totalPages ||
                            totalPages === 0
                        }
                        onClick={() =>
                            setCurrentPage((prev) => prev + 1)
                        }
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockAlert;