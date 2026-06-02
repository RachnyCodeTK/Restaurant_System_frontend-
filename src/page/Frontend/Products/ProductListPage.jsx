import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./ListProduct.css";
import usePagination from "../../../hook/usePagination";
// import "../../../style/dashboard.css";

// IMPORT PRODUCT APIs
import { deleteProduct, getProducts } from "../../../services/api";

const ProductListPage = () => {
  const navigate = useNavigate();
 
  // PRODUCT STATES

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  // LOAD PRODUCTS FROM BACKEND

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();

      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // SEARCH FILTER
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = search.toLowerCase();

      return (
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

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


  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);

      // RELOAD PRODUCT LIST
      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />
        {/* //Header section with title and add product button */}
        <div className="page-title">
          <div>
            <h2>Product List</h2>
            <p>Products from MySQL database</p>
          </div>

          <button
            className="btn-add-new"
            onClick={() => navigate("/add-product")}
          >
            + Add Product
          </button>
        </div>

        <input
          className="search-input-product"
          placeholder="Search product by code and name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
        />

        {loading ? (
          <h3>Loading products...</h3>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Photo</th>
                  <th>Action</th>
                </tr>
              </thead>
    
              <tbody>
                {paginatedItems.map((product) => (
                  <tr key={product.prd_id}>
                    <td>{product.prd_id}</td>
                    <td>{product.prd_code}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.qty}</td>
                    <td>{product.photo}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/edit-product/${product.prd_id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product.prd_id)}
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

export default ProductListPage;
