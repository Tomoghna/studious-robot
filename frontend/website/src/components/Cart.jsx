import React from "react";

const Cart = () => {
    const cartItems = [
        {
            id: 1,
            name: "Handmade Painting",
            price: 300,
            quantity: 1,
            image: "/product-1.jpg",
        },
        {
            id: 2,
            name: "Golden Inscense Box",
            price: 150,
            quantity: 2,
            image: "/product-1.jpg",
        },
    ];

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b pb-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">Price: ${item.price}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="text-lg font-bold">${item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold">Total: ${totalPrice}</h2>
        <button className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600">
          Proceed to Checkout
        </button>
      </div>
    </div>
    );
};

export default Cart;