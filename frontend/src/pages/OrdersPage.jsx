import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import api from "../utils/api";

const OrdersPage = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      if (!user) return;
      const res = await api.get(`/api/v1/users/orders/`);
      if (res.status === 200) {
        setOrders(res.data?.data || []);
      } else showSnackbar(res.data.message || "Failed to fetch orders", "error");
    } catch (error) {
      console.error(error);
      showSnackbar(error.message || "Network error", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!confirm("Cancel this order?")) return;
    try {
      const res = await api.patch(`/api/v1/users/orders/cancel/${orderId}`);
      if (res.status === 200) {
        showSnackbar("Order cancelled", "success");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.data : o)),
        );
      } else showSnackbar(res.data.message || "Cancel failed", "error");
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || "Network error", "error");
    }
  };

  if (!user)
    return (
      <div className="container mx-auto p-4">
        Please log in to view your orders.
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">Order {order._id}</h2>
            <p>Status: {order.orderStatus}</p>
            <p>Total: ₹{order.totalPrice}</p>
            <div className="mt-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleCancel(order._id)}
              >
                Cancel Order
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
