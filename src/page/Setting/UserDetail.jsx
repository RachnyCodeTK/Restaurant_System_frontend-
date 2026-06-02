import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import axios from "axios";
import "./UserDetail.css";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const isCustomer = location.pathname.startsWith("/customer-details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: 1,
  });

  const normalizeData = (data) => {
    if (isCustomer) {
      return {
        id: data.cust_id,
        name: data.cust_name,
        email: data.cust_email,
        role: "customer",
        status: data.cust_status,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
      };
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  const getDateString = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  // ===========================
  // FETCH USER DETAILS
  // ===========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = isCustomer ? "customer" : "user";
        const res = await axios.get(`http://localhost:3000/api/${endpoint}/${id}`);
        const normalized = normalizeData(res.data.data);
        setUser(normalized);
        setFormData({
          name: normalized.name,
          email: normalized.email,
          role: normalized.role,
          status: normalized.status,
        });
      } catch (err) {
        console.error("Fetch user error:", err);
        setMessage("❌ Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isCustomer]);

  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "status" ? parseInt(value, 10) : value,
    });
  };

  // ===========================
  // SAVE CHANGES
  // ===========================
  const handleSave = async () => {
    try {
      if (isCustomer) {
        await axios.put(`http://localhost:3000/api/customer`, {
          cust_id: id,
          cust_name: formData.name,
          cust_email: formData.email,
          cust_status: formData.status,
        });
      } else {
        await axios.put(`http://localhost:3000/api/user/${id}`, {
          name: formData.name,
          email: formData.email,
        });
      }
      setMessage("✅ User updated successfully");
      setIsEditing(false);
      setTimeout(() => {
        navigate("/user-settings");
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Failed to update user");
    }
  };

  // ===========================
  // DELETE USER
  // ===========================
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const endpoint = isCustomer ? "customer" : "user";
        await axios.delete(`http://localhost:3000/api/${endpoint}/${id}`);
        setMessage("✅ User deleted successfully");
        setTimeout(() => {
          navigate("/user-settings");
        }, 1500);
      } catch (err) {
        console.error("Delete error:", err);
        setMessage("❌ Failed to delete user");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>User not found</p>;

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="user-detail-wrapper">
          <div className="detail-header">
            <h2>{isCustomer ? "Customer Details" : "User Details"}</h2>
            <button
              className="btn-back"
              onClick={() => navigate("/user-settings")}
            >
              ← Back
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <div className="detail-card">
            <div className="detail-section">
              <h3>Personal Information</h3>

              <div className="form-group">
                <label>{isCustomer ? "Customer ID" : "User ID"}</label>
                <input type="text" value={user.id} disabled />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {isCustomer ? (
                <div className="form-group">
                  <label>Type</label>
                  <input type="text" value="Customer" disabled />
                </div>
              ) : (
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="detail-section">
              <h3>Additional Information</h3>

              <div className="form-group">
                <label>Created At</label>
                <input
                  type="text"
                  value={getDateString(user.created_at)}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Last Updated</label>
                <input
                  type="text"
                  value={getDateString(user.updated_at)}
                  disabled
                />
              </div>
            </div>

            <div className="button-group">
              {!isEditing ? (
                <>
                  <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-delete" onClick={handleDelete}>
                    🗑️ Delete
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-save" onClick={handleSave}>
                    ✓ Save Changes
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        status: user.status,
                      });
                    }}
                  >
                    ✕ Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
