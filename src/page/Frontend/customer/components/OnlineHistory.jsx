import { useAuth } from "../../../../../src/context/AuthContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderByEmail } from "../../../../../src/services/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/OnlineShop.css";

const OnlineHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.email) {
            setOrders([]);
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await getOrderByEmail(user.email);
                // Normalize possible response shapes
                const payload = response?.data ?? response;
                let ordersArray = [];
                if (Array.isArray(payload)) ordersArray = payload;
                else if (Array.isArray(payload?.orders)) ordersArray = payload.orders;
                else if (Array.isArray(payload?.data)) ordersArray = payload.data;
                else if (Array.isArray(payload?.results)) ordersArray = payload.results;
                setOrders(ordersArray);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleOrderClick = (orderId) => {
        navigate(`/customer/online-order/${orderId}`);
    };

    const formatDate = (d) => {
        try {
            return d ? new Date(d).toLocaleString() : "";
        } catch (e) {
            return d;
        }
    };

    const formatPrice = (v) => {
        if (v == null) return "-";
        return Number(v).toLocaleString(undefined, { style: "currency", currency: "USD" });
    };

    return (
        <div className="online-history-container">
            <Navbar />
            <div className="online-history-content">
                <h2>Online Order History</h2>
                {loading ? (
                    <p>Loading your orders…</p>
                ) : orders.length === 0 ? (
                    <p>No online orders found for your account.</p>
                ) : (
                    <div className="order-list">
                        {orders.map((order) => {
                            const id = order.order_id ?? order.id ?? order._id;
                            return (
                                <div
                                    key={id}
                                    className="order-item"
                                    onClick={() => handleOrderClick(id)}
                                >
                                    <h3>Foodie</h3>
                                    {order.invoice_number && <p><strong>Invoice:</strong> {order.invoice_number}</p>}
                                    <p><strong>Date:</strong> {formatDate(order.created_at ?? order.createdAt)}</p>
                                    <p><strong>Customer:</strong> {order.cust_email ?? user.email}</p>
                                    {order.description && <p><strong>Description:</strong> {order.description}</p>}
                                    <p><strong>Total:</strong> {formatPrice(order.total_amount ?? order.total)}</p>
                                    <p><strong>Status:</strong> {order.order_status ?? order.status}</p>
                                    <p><strong>Payment Status:</strong> {order.payment_status ?? order.paymentStatus}</p>
                                    <p><strong>Payment Method:</strong> {order.payment_method_code ?? order.payment_method}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default OnlineHistory;