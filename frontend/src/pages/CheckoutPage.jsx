import React, {useState, useEffect} from "react";
import {useCart} from "../contexts/CartContext";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import Razorpay from "razorpay";

const CheckoutPage = () => {
    const {cartItem, getCartTotal} = useCart();
    const {user} = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);

    useEffect(() => {
        if (user?.address?.length) {
            const defaultAddr = user.address.find(addr => addr.defaultAddress) || user.address[0];
            setSelectedAddress(defaultAddr);
        }
    }, [user]);

    const handlePayment = async () => {
        const response = await fetch("/api/create-razorpay-order", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({amount: getCartTotal()}),
        });

        const data = await response.json();

        const options = {
            key: "YOUR_RAZORPAY_KEY_ID",
            amount: data.amount,
            currency: "INR",
            name: "MAYUR HAMSA",
            description: "Order Payment",
            order_id: data.orderId,
            handler: function (response) {
                navigate("/orders");
            },
            prefill: {
                name: user.name,
                email: user.email,
                contact: user.phone,
            },
            theme: {color: "#3399cc"},
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex items-center mb-8">
                <div className={`flex-1 h-2 rounded ${step >= 0 ? "bg-blue-600" : "bg-gray-300"}`}></div>
                <div className={`flex-1 h-2 rounded mx-2 ${step >= 1 ? "bg-blue-600" : "bg-gray-300"}`}></div>
                <div className={`flex-1 h-2 rounded ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            </div>

            {step === 0 && (
                <div>
                    <h2 className="text-3xl font-bold mb-4">Select Delivery Address</h2>
                    <div className="mb-4">
                        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 cursor-pointer" onClick={() => setShowAddressDropdown(!showAddressDropdown)}>
                            <div className="flex justify-between items-center">
                                <span>
                                    {slectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zip}` : "No address found"}
                                </span>
                                <span className="text-blue-600">Change</span>
                            </div>
                        </div>
                        {showAddressDrpdown && (
                            <div className="mt-2 space-y-2">
                                {user.address.map((addr, idx) => (
                                    <div ley={idx} className={`border rounded-lg bg-white dark:bg-gray-800 cursor-pointer ${selectedAddress === addr ? "border-blue-600" : ""}`} onClick={()=> {setSelectedAddress(addr); setShowAddressDropdown(false);}}>
                                        {`${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip}`} {addr.defaultAddress && (
                                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Default</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => setStep(1)}>Continue</button>
                </div>
            )}

            {step === 1 && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Review Order</h2>
                    <ul className="mb-4">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between py-2 border-b">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="font-bold text-lg mb-4">Total: ₹{getCartTotal()}</div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => setStep(2)}>Proceed to Payment</button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2 className="text-3xl font-bold mb-4">Payment</h2>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold" onClick={handlePayment}>Pay with Razorpay</button>
                </div>
            )}
        </div>
    );
};


export default CheckoutPage;