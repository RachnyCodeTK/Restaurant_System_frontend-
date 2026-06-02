import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import axios from "axios";
import { getImageUrl } from "../../../utils/imageUtils";
 
const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get product ID from URL

  const [form, setForm] = useState({
    prd_id: "",
    name: "",
    price: "",
    qty: "",
    photo: "",
    brand_id: "",
    cat_id: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===========================
  // LOAD PRODUCT DATA
  // ===========================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/product/${id}`);
        
        const product = res.data.data;

        setForm({
          prd_id: product.prd_id,
          name: product.name,
          price: product.price,
          qty: product.qty,
          photo: product.photo || "",
          brand_id: product.brand_id || "",
          cat_id: product.cat_id || "",
        });

        // Set initial photo preview
        if (product.photo) {
          setPhotoPreview(getImageUrl(product.photo));
        }

      } catch (err) {
        console.error(err);
        setMessage("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  // ===========================
  // HANDLE INPUT
  // ===========================
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // ===========================
  // HANDLE FILE SELECTION
  // ===========================
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

  // ===========================
  // SUBMIT UPDATE
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.name || !form.price || form.qty === "") {
      setMessage("❌ Please fill in all required fields (Name, Price, Quantity)");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let response;

      // If new file selected, use FormData
      if (photoFile) {
        const formData = new FormData();
        formData.append("prd_id", form.prd_id);
        formData.append("name", form.name.trim());
        formData.append("price", parseFloat(form.price));
        formData.append("qty", parseInt(form.qty));
        formData.append("brand_id", form.brand_id ? parseInt(form.brand_id) : null);
        formData.append("cat_id", form.cat_id ? parseInt(form.cat_id) : null);
        formData.append("photo", photoFile);

        response = await axios.put("http://localhost:3000/api/product", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // No file selected, use JSON
        const updateData = {
          prd_id: parseInt(form.prd_id),
          name: form.name.trim(),
          price: parseFloat(form.price),
          qty: parseInt(form.qty),
          brand_id: form.brand_id ? parseInt(form.brand_id) : null,
          cat_id: form.cat_id ? parseInt(form.cat_id) : null,
        };

        response = await axios.put("http://localhost:3000/api/product", updateData);
      }

      console.log("Update response:", response.data);

      setMessage("✅ Product updated successfully");

      setTimeout(() => {
        navigate("/products-list");
      }, 1500);

    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Error updating product";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <h2>Edit Product</h2>

        <form onSubmit={handleSubmit}>
          <input name="prd_id" type="hidden" value={form.prd_id} />
          <h5 style={{ color: "black" }}>Product Name</h5>          <input 
            name="name" 
            value={form.name} 
            onChange={handleInput} 
            placeholder="Product Name" 
            required 
          />
          <h5 style={{ color: "black" }}>Price</h5>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            value={form.price} 
            onChange={handleInput} 
            placeholder="Price" 
            required 
          />
          <h5 style={{ color: "black" }}>Quantity</h5>
          <input 
            name="qty" 
            type="number" 
            value={form.qty} 
            onChange={handleInput} 
            placeholder="Quantity" 
            required 
          />

          {/* ===== IMAGE SECTION ===== */}
          <div className="image-input-section" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <label className="image-mode-label">Product Image</label>

            {/* IMAGE PREVIEW */}
            {photoPreview && (
              <div className="image-preview">
                <img src={photoPreview} alt="Product Preview" />
              </div>
            )}

            {/* FILE UPLOAD */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
            {photoFile && <p style={{ color: "green", marginTop: "5px" }}>✓ New image selected</p>}
          </div>

          <h5 style={{ color: "black" }}>Brand ID</h5>
          <input 
            name="brand_id" 
            type="number" 
            value={form.brand_id} 
            onChange={handleInput} 
            placeholder="Brand ID" 
          />
          <h5 style={{ color: "black" }}>Category ID</h5>
          <input 
            name="cat_id" 
            type="number" 
            value={form.cat_id} 
            onChange={handleInput}
            placeholder="Category ID" 
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>

        {message && (
          <p className={message.includes("✅") ? "message-success" : "message-error"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditProductPage;