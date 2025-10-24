import React, {useState, useEffect} from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";

const API_URL = import.meta.env.VITE_SERVER_URL;

const OrdersPage = () => {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // problem with frontend 
        if (!user) return;
        (async () => {
            try {
                const res = await fetch(`${API_URL}/api/v1/users/orders/`, { credentials: 'include' });
                const data = await res.json();
                console.log(data);
                if (res.ok) setOrders(data.data || []);
                else showSnackbar(data.message || 'Failed to fetch orders', 'error');
            } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
        })();
    }, [user]);

    const handleCancel = async (orderId) => {
        if (!confirm('Cancel this order?')) return;
        try {
            const res = await fetch(`${API_URL}/api/v1/users/orders/cancel/${orderId}`, { method: 'PATCH', credentials: 'include' });
            const data = await res.json();
            if (res.ok) { showSnackbar('Order cancelled', 'success'); setOrders((prev) => prev.map(o => o._id === orderId ? data.data : o)); }
            else showSnackbar(data.message || 'Cancel failed', 'error');
        } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
    };

    if (!user) return <div className="container mx-auto p-4">Please log in to view your orders.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
            <ul className="space-y-4">
                {orders.map(order => (
                    <li key={order._id} className="border p-4 rounded-lg">
                        <h2 className="font-semibold">Order {order._id}</h2>
                        <p>Status: {order.orderStatus}</p>
                        <p>Total: ₹{order.totalPrice}</p>
                        <div className="mt-2">
                            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleCancel(order._id)}>Cancel Order</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersPage;