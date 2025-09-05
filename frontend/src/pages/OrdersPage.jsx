import React, {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";

const OrdersPage = () => {
    const {user} = useContext(AuthContext);

    if(!user.isLoggedIn) {
        return <div>Please log in to view your orders.</div>;
    }

    const orders = [
        {id: 1, items: 'Product 1', status: 'Shipped'},
        {id: 2, items: 'Product 2', status: 'Delivered'},
        {id: 3, items: 'product 3', status: 'Pending'},
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
            <ul className="space-y-4">
                {orders.map(order => (
                    <li key={order.id} className="border p-4 rounded-lg">
                        <h2 className="font-semibold">{order.item}</h2>
                        <p>Status: {order.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersPage;