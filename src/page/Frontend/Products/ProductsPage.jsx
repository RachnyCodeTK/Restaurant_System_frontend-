import React, { useMemo, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import usePagination from "../../../hook/usePagination";
// import "../../../style/dashboard.css";
// import "./products.css";

const initialProducts = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Main",
    price: 8.5,
    stock: 24,
    description: "Juicy burger with lettuce, tomato and sauce.",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 11.0,
    stock: 12,
    description: "Cheesy pizza with fresh basil and tomato sauce.",
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salad",
    price: 7.25,
    stock: 18,
    description: "Crispy greens with parmesan and creamy dressing.",
  },
];

const ProductsPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    code: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = search.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    resetPage,
  } = usePagination(filteredProducts);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name || !form.category || !form.price || !form.stock) {
      return;
    }

    const nextId = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = {
      id: nextId,
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      description: form.description,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setForm({ name: "", category: "", price: "", stock: "", description: "" });
    resetPage();
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="page-title">
          <div>
            <h2>Product Management</h2>
            <p>Add new products and review the product catalog from one dashboard screen.</p>
          </div>
        </div>

        <div className="product-page">
          <div className="product-form-panel">
            <div className="panel-header">
              <h3>Add Product</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                Product Code
                <input
                  name="code"
                  value={form.code}
                  onChange={handleInput}
                  placeholder="Enter product code"
                />
              </label>

              <label>
                Product Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  placeholder="Enter product name"
                />
              </label>

              <label>
                Category
                <input
                  name="category"
                  value={form.category}
                  onChange={handleInput}
                  placeholder="Enter product category"
                />
              </label>

              <label>
                Price ($)
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleInput}
                  placeholder="0.00"
                />
              </label>

              <label>
                Stock Quantity
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleInput}
                  placeholder="Enter stock count"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  placeholder="Optional product description"
                />
              </label>

              <button type="submit">Add Product</button>
            </form>
          </div>

          <div className="product-list-panel">
            <div className="panel-header list-header">
              <div>
                <h3>Product List</h3>
                <p>{filteredProducts.length} items in catalog</p>
              </div>
              <input
                className="search-input"
                placeholder="Search product name, category, description"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
              />
            </div>

            <div className="product-list-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
