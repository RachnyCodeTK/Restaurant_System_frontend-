
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import React, { useMemo, useState } from "react";
import "./SupplierManagement.css";

const demoSuppliers = [
    {
        id: 1,
        code: "SUP001",
        name: "Fresh Food Supply",
        contact: "John Smith",
        phone: "+855 12 345 678",
        email: "freshfood@gmail.com",
        address: "Phnom Penh",
        status: "Active",
    },
    {
        id: 2,
        code: "SUP002",
        name: "Drink World",
        contact: "David Lee",
        phone: "+855 98 222 333",
        email: "drinkworld@gmail.com",
        address: "Siem Reap",
        status: "Active",
    },
    {
        id: 3,
        code: "SUP003",
        name: "Bakery Supplier",
        contact: "Sok Dara",
        phone: "+855 77 888 999",
        email: "bakery@gmail.com",
        address: "Battambang",
        status: "Inactive",
    },
];

function SupplierManagement() {
    const [suppliers, setSuppliers] = useState(demoSuppliers);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            const matchSearch =
                supplier.name.toLowerCase().includes(search.toLowerCase()) ||
                supplier.code.toLowerCase().includes(search.toLowerCase()) ||
                supplier.contact.toLowerCase().includes(search.toLowerCase());

            if (filter === "active") {
                return matchSearch && supplier.status === "Active";
            }

            if (filter === "inactive") {
                return matchSearch && supplier.status === "Inactive";
            }

            return matchSearch;
        });
    }, [suppliers, search, filter]);

    const totalSuppliers = suppliers.length;

    const activeSuppliers = suppliers.filter(
        (item) => item.status === "Active"
    ).length;

    const inactiveSuppliers = suppliers.filter(
        (item) => item.status === "Inactive"
    ).length;

    return (
        <div className="supplier-container">
            <Sidebar />

            <div className="supplier-wrapper">
                <Header />
                <div className="supplier-header">
                    <div>
                        <h1>Supplier Management</h1>
                        <p>Manage supplier information and supplier status.</p>
                    </div>

                    <button onClick={() => (window.location.href = "/add-supplier")} className="add-btn">+ Add Supplier</button>
                </div>

                {/* SUMMARY */}
                <div className="summary-grid">
                    <div className="card">
                        <div className="card-content">
                            <div>
                                <p>Total Suppliers</p>
                                <h2>{totalSuppliers}</h2>
                            </div>

                            <div className="icon">🏢</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-content">
                            <div>
                                <p>Active Suppliers</p>
                                <h2 className="green">{activeSuppliers}</h2>
                            </div>

                            <div className="icon">✅</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-content">
                            <div>
                                <p>Inactive Suppliers</p>
                                <h2 className="red">{inactiveSuppliers}</h2>
                            </div>

                            <div className="icon">❌</div>
                        </div>
                    </div>
                </div>

                {/* FILTER */}
                <div className="card filter-box">
                    <div className="filter-row">
                        <input
                            type="text"
                            placeholder="Search supplier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Suppliers</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Supplier Code</th>
                                    <th>Supplier Name</th>
                                    <th>Contact Person</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th className="center">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSuppliers.length > 0 ? (
                                    filteredSuppliers.map((supplier) => (
                                        <tr key={supplier.id}>
                                            <td>{supplier.code}</td>
                                            <td>{supplier.name}</td>
                                            <td>{supplier.contact}</td>
                                            <td>{supplier.phone}</td>
                                            <td>{supplier.email}</td>
                                            <td>{supplier.address}</td>

                                            <td className="center">
                                                <span
                                                    className={`status ${supplier.status === "Active"
                                                            ? "status-green"
                                                            : "status-red"
                                                        }`}
                                                >
                                                    {supplier.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty">
                                            No suppliers found.
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

export default SupplierManagement;