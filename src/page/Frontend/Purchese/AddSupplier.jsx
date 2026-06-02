import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import React, { useState } from "react";
import "./AddSupplier.css";

function AddSupplier() {
  const [supplier, setSupplier] = useState({
    code: "",
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Supplier Data:", supplier);

    alert("Supplier Added Successfully!");

    setSupplier({
      code: "",
      name: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
      status: "Active",
    });
  };

  return (
    
    <div className="add-supplier-container">
        <Sidebar />
      
      <div className="add-supplier-card">
        <Header />
        {/* HEADER */}
        <div className="form-header">
          <h1>Add New Supplier</h1>
          <p>Fill in supplier information below.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Supplier Code */}
            <div className="form-group">
              <label>Supplier Code</label>

              <input
                type="text"
                name="code"
                placeholder="Enter supplier code"
                value={supplier.code}
                onChange={handleChange}
                required
              />
            </div>

            {/* Supplier Name */}
            <div className="form-group">
              <label>Supplier Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter supplier name"
                value={supplier.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contact Person */}
            <div className="form-group">
              <label>Contact Person</label>

              <input
                type="text"
                name="contact"
                placeholder="Enter contact person"
                value={supplier.contact}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={supplier.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={supplier.email}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={supplier.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Address */}
            <div className="form-group full-width">
              <label>Address</label>

              <textarea
                name="address"
                rows="4"
                placeholder="Enter supplier address"
                value={supplier.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={() => window.location.href = "/supplier-management"}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Save Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;