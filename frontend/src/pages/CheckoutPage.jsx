import React, {useState, useEffect} from "react";
import {useCart} from "../contexts/CartContext";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import Razorpay from "razorpay";


const CheckoutPage = () => {
    const {cartItems, getCartTotal} = useCart();
    const {user} = useAuth();
    const navigate = useNavigate();

    // Progress bar step: 0=Address, 1=Review, 2=Payment
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
            body: JSON.stringify({amount: getCartTotal() }),
        });
        const data = await response.json();

        const options = {
            key: "YOUR_RAZORPAY_KEY_ID",
            amount: data.amount,
            currency: "INR",
            name: "MAYUR_HAMSA",
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

            <div className="flex-1 h-2 rounded "
        </div>
    )
}