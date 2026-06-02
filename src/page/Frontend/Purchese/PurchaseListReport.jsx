import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

import "./PurchaseListReport.css";

export default function PurchaseListReport() {

    // ============================
    // STATES
    // ============================
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [loading, setLoading] = useState(true);

    // ============================
    // FETCH PURCHASES
    // ============================
    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {

        try {

            const res = await axios.get(
                "http://localhost:3000/api/purchase"
            );

            setPurchases(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    // ============================
    // LOADING
    // ============================
    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="purchase-layout">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <div className="purchase-main">

                {/* HEADER */}
                <Header />

                {!selectedPurchase ? (

                    <div className="purchase-report">

                        {/* HEADER */}
                        <div className="report-header">

                            <div>

                                <h1>
                                    Purchase Report
                                </h1>

                                <p>
                                    Store Purchase Management Report
                                </p>

                            </div>

                        </div>

                        {/* TABLE */}
                        <div className="table-container">

                            <table className="purchase-table">

                                <thead>

                                    <tr>
                                        <th>PO Number</th>
                                        <th>Date</th>
                                        <th>Supplier</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {purchases.length > 0 ? (

                                        purchases.map((purchase) => (

                                            <tr key={purchase.pur_id}>

                                                <td>
                                                    {purchase.po_number}
                                                </td>

                                                <td>
                                                    {purchase.purchase_date}
                                                </td>

                                                <td>
                                                    {purchase.supplier}
                                                </td>

                                                <td>
                                                    $
                                                    {Number(
                                                        purchase.total_amount
                                                    ).toFixed(2)}
                                                </td>

                                                <td>

                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            setSelectedPurchase(
                                                                purchase
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td colSpan="5">
                                                No Purchases Found
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                ) : (

                    <div className="purchase-details-page">

                        {/* HEADER */}
                        <div className="details-header">

                            <div>

                                <h1>
                                    Purchase Details
                                </h1>

                                <p>
                                    Invoice :
                                    {" "}
                                    {selectedPurchase.po_number}
                                </p>

                            </div>

                            {/* ACTIONS */}
                            <div className="header-actions">

                                <button
                                    className="back-btn"
                                    onClick={() =>
                                        setSelectedPurchase(null)
                                    }
                                >
                                    Back
                                </button>

                                <button
                                    className="print-btn"
                                    onClick={() => window.print()}
                                >
                                    Print
                                </button>

                            </div>

                        </div>

                        {/* INFO CARD */}
                        <div className="info-card">

                            <div className="info-grid">

                                <div>

                                    <span>
                                        Supplier
                                    </span>

                                    <h3>
                                        {selectedPurchase.supplier}
                                    </h3>

                                </div>

                                <div>

                                    <span>
                                        Date
                                    </span>

                                    <h3>
                                        {selectedPurchase.purchase_date}
                                    </h3>

                                </div>

                                <div>

                                    <span>
                                        Total Amount
                                    </span>

                                    <h3>
                                        $
                                        {Number(
                                            selectedPurchase.total_amount
                                        ).toFixed(2)}
                                    </h3>

                                </div>

                            </div>

                        </div>

                        {/* PRODUCTS */}
                        <div className="products-card">

                            <div className="card-title">

                                <h2>
                                    Products List
                                </h2>

                            </div>

                            <table className="details-table">

                                <thead>

                                    <tr>
                                        <th>#</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {selectedPurchase?.products?.length > 0 ? (

                                        selectedPurchase.products.map(
                                            (product, index) => (

                                                <tr key={index}>

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        {product.product_name}
                                                    </td>

                                                    <td>
                                                        {product.qty}
                                                    </td>

                                                    <td>
                                                        $
                                                        {product.price}
                                                    </td>

                                                    <td>
                                                        $
                                                        {product.total}
                                                    </td>

                                                </tr>
                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td colSpan="5">
                                                No Products Found
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}