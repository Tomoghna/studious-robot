import React, {useState, useEffect} from "react";
import {useCart} from "../contexts/CartContext";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {FaCheckCircle, FaMapMarkerAlt, FaShoppingCart, FaCreditCard} from "react-icons/fa";


const CheckoutPage = () => {
    const {cartItems, getCartTotal}  = useCart();
    const {user} = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);

    useEffect(() => {
        if(user?.address?.length) {
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


    const steps = [
        {label: "Address", icon: <FaMapMarkerAlt/>},
        {label: "Review", icon: <FaShoppingCart/>},
        {label: "Payment", icon: <FaCreditCard/>},
    ];

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                {steps.map((s, idx) => (
                    <div key={s.label} className="flex-1 flex flex-col items-center">
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg ${step === idx ? "bg-blue-600 text-white" : step > idx ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                            {step > idx ? <FaCheckCircle/> : s.icon}
                        </div>
                        <span className={`mt-2 text-sm font-semibold ${step === idx ? "text-blue-600" : "text-gray-500"}`}>{s.label}</span>
                        {idx < steps.length - 1 && (
                            <div className={`h-1 w-full bg-${step > idx ? "green-500" : "gray-300"} mt-2`} />
                        )}
                    </div>
                ))}
            </div>

            {step === 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Select Delivery Address</h2>
                    <div className="mb-4">
                        {selectedAddress ? (
                            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 cursor-pointer shadow flex justify-between items-center" onClick={() => setShowAddressDropdown(!showAddressDropdown)}>
                                <div>
                                    <div className="font-semibold">{selectedAddress.fullName}</div>
                                    <div className="text-gray-700">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</div>
                                    <div className="text-gray-500 text-sm">{selectedAddress.phone}</div>
                                </div>
                                <span className="text-blue-600 font-medium">Change</span>
                            </div>
                        ) : (
                            <div className="text-gray-500">No address found</div>
                        )}
                        {showAddressDropdown && (
                            <div className="mt-4 grid gap-3">
                                {user.address.map((addr, idx) => (
                                    <div key={idx} className={`border rounded-lg p-4 bg-white dark:bg-gray-800 cursor-pointer shadow transition-all ${selectedAddress === addr ? "border-blue-600 ring-2 ring-blue-200" : ""}`} onClick={() => {setSelectedAddress(addr); setShowAddressDropdown(false);}}>
                                        <div className="font-semibold">{addr.fullName}</div>
                                        <div className="text-gray-700">{addr.street}, {addr.city}, {addr.state}, {addr.zip}</div>
                                        <div className="text-gray-500 text-sm">{addr.phone}</div>
                                        {addr.defaultAddress && (
                                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Default</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold w-full mt-4 hover:bg-blue-700 transition" onClick={() => setStep(1)} disabled={!selectedAddress}>Continue</button>
                </div>
            )}


            {step === 1 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Review Your Order</h2>
                    <div className="bg-white dark:bg-grau-800 rounded-lg shadow p-4 mb-4">
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.id} className="flex jusitfy-between py-2 border-b last:border-b-0">
                                    <span>{item.name} <span className="text-xs text-gray-500">x {item.quantity}</span> </span>
                                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between items-center mt-4">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-lg text-blue-600">₹{getCartTotal()}</span>
                        </div>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold w-full hover:bg-blue-700 transition" onClick={() => setStep(2)}>Proceed to Payment</button>
                </div>
            )}


            {step === 2 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Payment</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4 flex flex-col items-center">
                        <FaCreditCard className="text-4xl text-blue-600 mb-2"/>
                        <div className="mb-2 text-gray-700">Pay securely with Razorpay</div>
                        <div className="mb-4 text-gray-500 text-sm">Order Amount: <span className="font-bold text-blue-600">₹{getCartTotal()}</span></div>
                        <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition" onclick={handlePayment}>Pay with Razorpay</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;