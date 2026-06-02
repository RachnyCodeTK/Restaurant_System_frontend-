import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./SettingSystem.css";
const SettingSystem = () => {
    // OLD SAVED SETTINGS
    const [settings, setSettings] = useState({
        companyName: "🍴 Foodie Kitchen",
        email: "admin@foodie.com",
        phone: "+855 12 345 678",
        currency: "USD",
        language: "English",
        tax: 10,
        lowStockAlert: 5,
        receiptFooter: "Thank you for shopping with us!",
    });

    // CONTROL EDIT MODE
    const [isEdit, setIsEdit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings({
            ...settings,
            [name]: value,
        });
    };

    const handleSave = () => {
        setIsEdit(false);

        // SAVE API HERE
        console.log("Updated Settings:", settings);

        alert("Settings Updated Successfully!");
    };

    return (
        <div className="settings-page">
            <Sidebar />
            <div className="settings-container">
                {/* <Header /> */}
                <div className="header">
                    <h1 className="title">System Settings</h1>

                    {!isEdit ? (
                        <button
                            className="edit-btn"
                            onClick={() => setIsEdit(true)}
                        >
                            Edit Settings
                        </button>
                    ) : (
                        <button className="save-btn" onClick={handleSave}>
                            Save Changes
                        </button>
                    )}
                </div>

                <div className="settings-grid">
                    {/* COMPANY SETTINGS */}
                    <div className="card">
                        <h2 className="card-title">Company Information</h2>

                        <div className="form-group">
                            <label>Company Name</label>

                            {isEdit ? (
                                <input
                                    type="text"
                                    name="companyName"
                                    value={settings.companyName}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="value-text">
                                    {settings.companyName}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            {isEdit ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={settings.email}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="value-text">{settings.email}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Phone</label>

                            {isEdit ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={settings.phone}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="value-text">{settings.phone}</div>
                            )}
                        </div>
                    </div>

                    {/* SYSTEM SETTINGS */}
                    <div className="card">
                        <h2 className="card-title">System Configuration</h2>

                        <div className="form-group">
                            <label>Currency</label>

                            {isEdit ? (
                                <select
                                    name="currency"
                                    value={settings.currency}
                                    onChange={handleChange}
                                >
                                    <option>USD</option>
                                    <option>KHR</option>
                                    <option>THB</option>
                                </select>
                            ) : (
                                <div className="value-text">{settings.currency}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Language</label>

                            {isEdit ? (
                                <select
                                    name="language"
                                    value={settings.language}
                                    onChange={handleChange}
                                >
                                    <option>English</option>
                                    <option>Khmer</option>
                                    <option>Thai</option>
                                </select>
                            ) : (
                                <div className="value-text">{settings.language}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Tax (%)</label>

                            {isEdit ? (
                                <input
                                    type="number"
                                    name="tax"
                                    value={settings.tax}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="value-text">{settings.tax}%</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Low Stock Alert</label>

                            {isEdit ? (
                                <input
                                    type="number"
                                    name="lowStockAlert"
                                    value={settings.lowStockAlert}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="value-text">
                                    {settings.lowStockAlert} Items
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RECEIPT SETTINGS */}
                    <div className="card">
                        <h2 className="card-title">Receipt Settings</h2>

                        <div className="form-group">
                            <label>Receipt Footer</label>

                            {isEdit ? (
                                <textarea
                                    rows="5"
                                    name="receiptFooter"
                                    value={settings.receiptFooter}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="value-text">
                                    {settings.receiptFooter}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingSystem;