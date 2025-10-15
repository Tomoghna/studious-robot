import React, {useState} from "react";

const mockOrders = [
    {id: 1, items: "Product 1", status: "Shipped", details: "Order #1 details..."},
    {id: 2, items: "Product 2", status: "Delivered", details: "Order #2 details..."},
    {id: 3, items: "Product 3", status: "Pending", details: "Order #3 details..."},
];

const OrdersTab = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Your Orders</h2>
            <ul className="space-y-2">
                {mockOrders.map(order => (
                    <li key={order.id} className="border p-3 rounded cursor-pointer hover:bg-gray-100" onClick={() => setSelectedOrder(order)}>
                        <div className="font-semibold">{OrdersTab.item}</div>
                        <div>Status: {order.status}</div>
                    </li>
                ))}
            </ul>
            {selectedOrder && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Order Details</h3>
                    <div>{selectedOrder.details}</div>
                    <button className="mt-2 text-blue-600 hover:underline" onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;