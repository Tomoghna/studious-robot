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
        
    })
}