import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import api from "../utils/api";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressOpen, setAddressOpen] = useState(false);

  useEffect(() => {
    if (user?.address?.length) {
      const defaultAddr =
        user.address.find((a) => a.defaultAddress) || user.address[0];
      setSelectedAddress(defaultAddr);
    } else {
      setSelectedAddress(null);
    }
  });
  const steps = ["Address", "Review", "Payment"];

  const handleNext = () =>
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const handleCreateOrder = async () => {
    try {
      if (!selectedAddress) {
        showSnackbar("Please select an address", "error");
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        showSnackbar("Your cart is empty", "error");
        return;
      }

      const items = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const payload = {
        items,
        shippingAddress: `AddLine1: ${selectedAddress.AddLine1},city: ${selectedAddress.city},state: ${selectedAddress.state},pinCode: ${selectedAddress.pinCode},`,
        payment: paymentMethod, // "COD" or "Razorpay"
      };

      const res = await api.post("/api/v1/users/orders/create", payload);

      const { order, razorpayOrder } = res.data.data;
      const currentOrderId = order._id;

      // COD flow
      if (paymentMethod === "COD") {
        localStorage.removeItem("pendingOrderId");
        showSnackbar("Order placed successfully", "success");
        navigate("/order-success", { state: { orderId: currentOrderId, paymentMethod: "COD" } });
        return;
      }

      // Razorpay flow
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "Mayur Hamsa",
        description: "Order Payment",

        handler: async function (response) {
          try {
            if (!currentOrderId) {
              throw new Error("Order ID not found. Please try again.");
            }

            const verifyRes = await api.post("/api/v1/payment/verify-payment", {
              orderId: currentOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.status === 200) {
              showSnackbar("Payment successful", "success");
              navigate("/order-success", { state: { orderId: currentOrderId, paymentMethod: "Razorpay" } });
            } else {
              showSnackbar("Payment verification failed", "error");
            }
          } catch (error) {
            console.error(error);
            showSnackbar(
              error?.response?.data?.message || "Payment verification failed",
              "error",
            );
          }
        },

        modal: {
          ondismiss: function () {
            showSnackbar("Payment cancelled", "error");
          },
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        notes: {
          orderId: order._id,
        },

        theme: {
          color: "#111827",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        showSnackbar(response.error.description || "Payment failed", "error");
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      showSnackbar(
        err?.response?.data?.message || err.message || "Order creation failed",
        "error",
      );
    }
  };
  return (
    <Box sx={{ maxWidth: 920, mx: "auto", py: 6, px: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Delivery Address
          </Typography>

          {selectedAddress ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 1,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {selectedAddress.AddLine1}, {selectedAddress.city},{" "}
                  {selectedAddress.state}, {selectedAddress.pinCode}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {user.phone}
                </Typography>
              </Box>
              <Button variant="text" onClick={() => setAddressOpen((s) => !s)}>
                Change
              </Button>
            </Box>
          ) : (
            <Typography color="text.secondary">
              No address found. Please add an address in your profile.
            </Typography>
          )}

          {addressOpen && user?.address?.length > 0 && (
            <List sx={{ mt: 2, bgcolor: "background.paper", borderRadius: 1 }}>
              {user.address.map((addr, idx) => (
                <React.Fragment key={idx}>
                  <ListItem
                    button
                    selected={selectedAddress === addr}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setAddressOpen(false);
                    }}
                  >
                    <ListItemText
                      primary={user.name}
                      secondary={`${addr.AddLine1}, ${addr.city}, ${addr.state}, ${addr.pinCode} • ${user.phone}`}
                    />
                    {addr.defaultAddress && (
                      <Typography variant="caption" color="primary">
                        Default
                      </Typography>
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedAddress}
            >
              Continue
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Review Your Order
          </Typography>
          <List>
            {cartItems.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Typography sx={{ fontWeight: 700 }}>
                    ₹{item.price * item.quantity}
                  </Typography>
                }
              >
                <ListItemText
                  primary={`${item.name} x ${item.quantity}`}
                  secondary={item.variant || ""}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Total
            </Typography>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              ₹{getCartTotal()}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Proceed to Payment
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment
          </Typography>

          <FormControl sx={{ width: "100%", mt: 2 }}>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  border:
                    paymentMethod === "COD"
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                }}
              >
                <FormControlLabel
                  value="COD"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  Pay when your order is delivered
                </Typography>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  border:
                    paymentMethod === "Razorpay"
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                }}
              >
                <FormControlLabel
                  value="Razorpay"
                  control={<Radio />}
                  label="Pay Online"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  UPI, Cards, Net Banking, Wallets
                </Typography>
              </Paper>
            </RadioGroup>
          </FormControl>

          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Order Amount: <strong>₹{getCartTotal()}</strong>
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>

              <Button
                variant="contained"
                color={paymentMethod === "COD" ? "success" : "primary"}
                onClick={handleCreateOrder}
              >
                {paymentMethod === "COD"
                  ? "Place Order (COD)"
                  : "Pay with Razorpay"}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CheckoutPage;
