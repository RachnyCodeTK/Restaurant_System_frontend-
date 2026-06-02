import React, { useState } from "react";

import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

import "./PurchaseOrder.css";

// API
import { createPurchase } from "../../../services/api";

export default function PurchaseOrder() {

    // ============================================
    // FORM STATES
    // ============================================
    const [poNumber, setPoNumber] = useState("");
    const [supplier, setSupplier] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");


    // ============================================
    // ITEMS STATE
    // ============================================
    const [items, setItems] = useState([
        {
            id: Date.now(),
            product: "",
            qty: 1,
            price: 0,
        },
    ]);


    // ============================================
    // ADD ITEM
    // ============================================
    const addItem = () => {

        setItems([
            ...items,
            {
                id: Date.now(),
                product: "",
                qty: 1,
                price: 0,
            },
        ]);
    };


    // ============================================
    // REMOVE ITEM
    // ============================================
    const removeItem = (id) => {

        const filteredItems = items.filter(
            (item) => item.id !== id
        );

        setItems(filteredItems);
    };


    // ============================================
    // HANDLE CHANGE
    // ============================================
    const handleChange = (
        id,
        field,
        value
    ) => {

        const updatedItems = items.map((item) => {

            if (item.id === id) {

                return {
                    ...item,
                    [field]: value,
                };
            }

            return item;
        });

        setItems(updatedItems);
    };


    // ============================================
    // TOTAL
    // ============================================
    const getTotal = () => {

        const total = items.reduce(
            (sum, item) =>
                sum + (item.qty * item.price),
            0
        );

        return total.toFixed(2);
    };


    // ============================================
    // SUBMIT PURCHASE
    // ============================================
    const submitPurchase = async () => {

        try {

            // VALIDATION
            if (
                !poNumber ||
                !supplier ||
                !purchaseDate
            ) {
                alert("Please fill all fields");
                return;
            }

            if (items.length === 0) {
                alert("Please add product");
                return;
            }

            // CHECK ITEMS
            for (const item of items) {

                if (!item.product) {
                    alert("Product name is required");
                    return;
                }

                if (item.qty <= 0) {
                    alert("Quantity must be greater than 0");
                    return;
                }

                if (item.price <= 0) {
                    alert("Price must be greater than 0");
                    return;
                }
            }

            // PAYLOAD
            const payload = {
                po_number: poNumber,
                supplier: supplier,
                purchase_date: purchaseDate,
                items: items,
            };

            console.log("PAYLOAD:", payload);

            // API REQUEST
            const response = await createPurchase(
                payload
            );

            console.log(response);

            alert(
                response.message ||
                "Purchase Created Successfully"
            );

            // RESET FORM
            setPoNumber("");
            setSupplier("");
            setPurchaseDate("");

            setItems([
                {
                    id: Date.now(),
                    product: "",
                    qty: 1,
                    price: 0,
                },
            ]);

        } catch (error) {

            console.log("ERROR:", error);

            alert(
                error.message ||
                "Error creating purchase"
            );
        }
    };


    return (
        <div className="purchase-container">

            <Sidebar />

            <div className="purchase-card">

                <Header />

                <h1 className="title">
                    Purchase Order
                </h1>


                {/* ============================================
                    FORM HEADER
                ============================================ */}
                <div className="form-header">

                    {/* PO NUMBER */}
                    <div className="input-group">

                        <label>PO Number</label>

                        <input
                            type="text"
                            placeholder="PO-0001"
                            value={poNumber}
                            onChange={(e) =>
                                setPoNumber(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* SUPPLIER */}
                    <div className="input-group">

                        <label>Supplier</label>

                        <input
                            type="text"
                            placeholder="Supplier Name"
                            value={supplier}
                            onChange={(e) =>
                                setSupplier(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* DATE */}
                    <div className="input-group">

                        <label>Date</label>

                        <input
                            type="date"
                            value={purchaseDate}
                            onChange={(e) =>
                                setPurchaseDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* ============================================
                    TABLE
                ============================================ */}
                <table>

                    <thead>

                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>

                    </thead>


                    <tbody>

                        {items.map((item) => (

                            <tr key={item.id}>

                                {/* PRODUCT */}
                                <td>

                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        value={item.product}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "product",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>


                                {/* QUANTITY */}
                                <td>

                                    <input
                                        type="number"
                                        min="1"
                                        value={item.qty}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "qty",
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />

                                </td>


                                {/* PRICE */}
                                <td>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "price",
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />

                                </td>


                                {/* TOTAL */}
                                <td>

                                    $
                                    {(item.qty * item.price)
                                        .toFixed(2)}

                                </td>


                                {/* ACTION */}
                                <td>

                                    <button
                                        className="btn btn-remove"
                                        onClick={() =>
                                            removeItem(item.id)
                                        }
                                    >
                                        Remove
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>


                {/* ============================================
                    ADD BUTTON
                ============================================ */}
                <button
                    className="btn btn-add"
                    onClick={addItem}
                >
                    + Add Product
                </button>


                {/* ============================================
                    SUMMARY
                ============================================ */}
                <div className="summary">

                    <div className="summary-box">

                        <div className="summary-row">

                            <span>
                                Total Amount:
                            </span>

                            <span className="summary-total">
                                ${getTotal()}
                            </span>

                        </div>


                        <button
                            className="btn submit-btn"
                            onClick={submitPurchase}
                        >
                            Submit Purchase Order
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

