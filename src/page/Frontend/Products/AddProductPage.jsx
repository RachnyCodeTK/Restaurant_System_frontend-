
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "../../../style/dashboard.css";
import "./AddProduct.css";
import "./products.css";

// IMPORT CREATE PRODUCT API
import { createProduct, createProductWithFile } from "../../../services/api";

const AddProductPage = () => {
  const navigate = useNavigate();

  // ============================================
  // FORM STATE
  // ============================================
  const [form, setForm] = useState({
    prd_code: "",
    name: "",
    price: "",
    qty: "",
    photo: "",
    brand_id: "",
    cat_id: "",
  });

  const [imageMode, setImageMode] = useState("url"); // "url" or "file"
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================
  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================
  // HANDLE FILE SELECTION
  // ============================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ============================================
  // HANDLE URL INPUT
  // ============================================
  const handlePhotoUrlChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, photo: url });
    setPhotoPreview(url);
  };

  // ============================================
  // TOGGLE IMAGE INPUT MODE
  // ============================================
  const toggleImageMode = (mode) => {
    setImageMode(mode);
    setPhotoFile(null);
    setPhotoPreview("");
    setForm({ ...form, photo: "" });
  };

  // ============================================
  // SAVE PRODUCT TO MYSQL DATABASE
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Use file upload API if file is selected, otherwise use regular API
      if (imageMode === "file" && photoFile) {
        const formData = new FormData();
        formData.append("prd_code", form.prd_code);
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("qty", form.qty);
        formData.append("brand_id", form.brand_id);
        formData.append("cat_id", form.cat_id);
        formData.append("photo", photoFile);

        await createProductWithFile(formData);
      } else {
        await createProduct(form);
      }

      setMessage("Product created successfully");

      setTimeout(() => {
        navigate("/products-list");
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <h2>Add Product</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="prd_code"
            placeholder="Product Code"
            value={form.prd_code}
            onChange={handleInput}
            required
          />

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleInput}
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleInput}
            required
          />

          <input
            name="qty"
            type="number"
            placeholder="Quantity"
            value={form.qty}
            onChange={handleInput}
            required
          />

          {/* ===== IMAGE INPUT SECTION ===== */}
          <div className="image-input-section">
            <label className="image-mode-label">Image Upload</label>
            
            <div className="image-mode-toggle">
              <button
                type="button"
                className={`toggle-btn ${imageMode === "url" ? "active" : ""}`}
                onClick={() => toggleImageMode("url")}
              >
                From URL
              </button>
              <button
                type="button"
                className={`toggle-btn ${imageMode === "file" ? "active" : ""}`}
                onClick={() => toggleImageMode("file")}
              >
                Upload File
              </button>
            </div>

            {imageMode === "url" ? (
              <input
                type="text"
                name="photo"
                placeholder="Enter image URL"
                value={form.photo}
                onChange={handlePhotoUrlChange}
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            )}

            {photoPreview && (
              <div className="image-preview">
                <img src={photoPreview} alt="Preview" />
              </div>
            )}
          </div>

          <input
            name="brand_id"
            placeholder="Brand ID"
            value={form.brand_id}
            onChange={handleInput}
          />

          <input
            name="cat_id"
            placeholder="Category ID"
            value={form.cat_id}
            onChange={handleInput}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>

        {message && <p className={message.includes("successfully") ? "message-success" : "message-error"}>{message}</p>}
      </div>
    </div>
  );
};

export default AddProductPage;
