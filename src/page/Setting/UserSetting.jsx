import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import axios from "axios";
import "./UserSetting.css";

const UserSetting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users"); // "users" or "customers"
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, active, inactive

  // ===========================
  // FETCH USERS
  // ===========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/user");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setMessage("❌ Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // FETCH CUSTOMERS
  // ===========================
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/customer");
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error("Fetch customers error:", err);
      setMessage("❌ Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // LOAD DATA ON TAB CHANGE
  // ===========================
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchCustomers();
    }
  }, [activeTab]);

  // ===========================
  // DELETE USER
  // ===========================
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/user/${id}`);
        setMessage("✅ User deleted successfully");
        fetchUsers();
      } catch (err) {
        console.error("Delete user error:", err);
        setMessage("❌ Failed to delete user");
      }
    }
  };

  // ===========================
  // DELETE CUSTOMER
  // ===========================
  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:3000/api/customer/${id}`);
        setMessage("✅ Customer deleted successfully");
        fetchCustomers();
      } catch (err) {
        console.error("Delete customer error:", err);
        setMessage("❌ Failed to delete customer");
      }
    }
  };

  // ===========================
  // FILTER USERS
  // ===========================
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && user.status === 1) ||
                         (selectedStatus === "inactive" && user.status === 0);
    return matchesSearch && matchesStatus;
  });

  // ===========================
  // FILTER CUSTOMERS
  // ===========================
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = (customer.cust_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         customer.cust_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && customer.cust_status === 1) ||
                         (selectedStatus === "inactive" && customer.cust_status === 0);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="user-setting-wrapper">
          <h2>User & Customer Management</h2>

          {/* TABS */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("users");
                setSearchTerm("");
                setSelectedStatus("all");
              }}
            >
              👥 Users (Staff)
            </button>
            <button
              className={`tab-btn ${activeTab === "customers" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("customers");
                setSearchTerm("");
                setSelectedStatus("all");
              }}
            >
              🛍️ Customers
            </button>
          </div>

          {/* SEARCH & FILTER */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* MESSAGE */}
          {message && <div className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</div>}

          {/* LOADING */}
          {loading && <p>Loading...</p>}

          {/* USERS TABLE */}
          {activeTab === "users" && !loading && (
            <div className="table-wrapper">
              <h3>Staff Users ({filteredUsers.length})</h3>
              {filteredUsers.length > 0 ? (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td className="name-col">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status === 1 ? "active" : "inactive"}`}>
                            {user.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="actions-col">
                          <button
                            className="btn btn-view"
                            onClick={() => navigate(`/user-details/${user.id}`)}
                            title="View Details"
                          >
                            👁️ View
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No users found</p>
              )}
            </div>
          )}

          {/* CUSTOMERS TABLE */}
          {activeTab === "customers" && !loading && (
            <div className="table-wrapper">
              <h3>Customers ({filteredCustomers.length})</h3>
              {filteredCustomers.length > 0 ? (
                <table className="customers-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.cust_id}>
                        <td>{customer.cust_id}</td>
                        <td className="name-col">{customer.cust_name || "N/A"}</td>
                        <td>{customer.cust_email}</td>
                        <td>{customer.cust_phone || "N/A"}</td>
                        <td>
                          <span className={`status-badge ${customer.cust_status === 1 ? "active" : "inactive"}`}>
                            {customer.cust_status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                        <td className="actions-col">
                          <button
                            className="btn btn-view"
                            onClick={() => navigate(`/customer-details/${customer.cust_id}`)}
                            title="View Details"
                          >
                            👁️ View
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDeleteCustomer(customer.cust_id)}
                            title="Delete Customer"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No customers found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSetting;