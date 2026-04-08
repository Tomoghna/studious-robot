import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract order details from navigation state
  const { orderId, paymentMethod } = location.state || {};

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        {/* Success Icon */}
        <Box sx={{ mb: 3 }}>
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 2,
            }}
          />
        </Box>

        {/* Success Message */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'success.main',
          }}
        >
          {paymentMethod === 'Razorpay' ? 'Payment Successful!' : 'Order Placed Successfully!'}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'text.secondary',
            fontSize: '1.1rem',
          }}
        >
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </Typography>

        {/* Order Details */}
        {orderId && (
          <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Order Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <ReceiptIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="body1">
                Order ID: <strong>{orderId}</strong>
              </Typography>
            </Box>
            {paymentMethod && (
              <Typography variant="body2" color="text.secondary">
                Payment Method: {paymentMethod}
              </Typography>
            )}
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleViewOrders}
            startIcon={<ReceiptIcon />}
            sx={{
              minWidth: 180,
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleContinueShopping}
            startIcon={<ShoppingBagIcon />}
            sx={{
              minWidth: 180,
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            Continue Shopping
          </Button>
        </Box>

        {/* Additional Info */}
        <Typography
          variant="body2"
          sx={{
            mt: 4,
            color: 'text.secondary',
            fontSize: '0.9rem',
          }}
        >
          You will receive an email confirmation shortly with your order details.
        </Typography>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage;
