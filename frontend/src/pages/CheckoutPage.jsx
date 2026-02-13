import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import api from "../utils/api";

const CheckoutPage = () => {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressOpen, setAddressOpen] = useState(false);

  useEffect(() => {
    if (user?.address?.length) {
      const defaultAddr = user.address.find((a) => a.defaultAddress) || user.address[0];
      setSelectedAddress(defaultAddr);
    } else {
      setSelectedAddress(null);
    }
  }, [user]);

  const steps = ["Address", "Review", "Payment"];

  const handleNext = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      showSnackbar('Please select an address', 'error');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      showSnackbar('Your cart is empty', 'error');
      return;
    }

    const items = cartItems.map((ci) => ({ product: ci.id, quantity: ci.quantity, price: ci.price }));
    try {
      const res = await api.post(`/api/v1/users/orders/create`,{ items, shippingAddress: selectedAddress, payment: { method: 'COD' } });
      if (res.status === 200) {
        showSnackbar(res.data.message || 'Order created', 'success');
        navigate('/orders');
      } else {
        showSnackbar(res.data.message || 'Order creation failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || 'Network error', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 920, mx: 'auto', py: 6, px: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Select Delivery Address</Typography>

          {selectedAddress ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{selectedAddress.fullName}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{selectedAddress.phone}</Typography>
              </Box>
              <Button variant="text" onClick={() => setAddressOpen((s) => !s)}>Change</Button>
            </Box>
          ) : (
            <Typography color="text.secondary">No address found. Please add an address in your profile.</Typography>
          )}

          {addressOpen && user?.address?.length > 0 && (
            <List sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              {user.address.map((addr, idx) => (
                <React.Fragment key={idx}>
                  <ListItem button selected={selectedAddress === addr} onClick={() => { setSelectedAddress(addr); setAddressOpen(false); }}>
                    <ListItemText primary={addr.fullName} secondary={`${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip} • ${addr.phone}`} />
                    {addr.defaultAddress && <Typography variant="caption" color="primary">Default</Typography>}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" onClick={handleNext} disabled={!selectedAddress}>Continue</Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
          </Box>
        </Paper>
      )}

      {activeStep === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Review Your Order</Typography>
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id} secondaryAction={<Typography sx={{ fontWeight: 700 }}>₹{item.price * item.quantity}</Typography>}>
                <ListItemText primary={`${item.name} x ${item.quantity}`} secondary={item.variant || ''} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>₹{getCartTotal()}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleBack}>Back</Button>
            <Button variant="contained" onClick={handleNext}>Proceed to Payment</Button>
          </Box>
        </Paper>
      )}

      {activeStep === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Payment</Typography>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography sx={{ mb: 1 }}>Pay securely with Razorpay</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Order Amount: <strong>₹{getCartTotal()}</strong></Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleBack}>Back</Button>
              <Button variant="contained" color="success" onClick={handleCreateOrder}>Place Order (COD)</Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CheckoutPage;