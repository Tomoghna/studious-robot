import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {useNavigate} from "react-router-dom";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Your cart is empty</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Looks like you haven't added any items yet</Typography>
          <Button component={Link} to="/products" variant="contained" color="primary">Continue Shopping</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cartItems.map((item) => (
              <Paper key={item.id} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Link to={`/product/${item.id}`} style={{ width: 96, height: 96 }}>
                  <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                </Link>
                <Box sx={{ flex: 1 }}>
                  <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                  </Link>
                  <Typography color="text.secondary">Price: ${item.price}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</IconButton>
                  <Typography sx={{ width: 32, textAlign: 'center' }}>{item.quantity}</Typography>
                  <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</IconButton>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6">${(item.price * item.quantity).toFixed(2)}</Typography>
                  <Button color="error" onClick={() => removeFromCart(item.id)}>Remove</Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mb: 1 }}>
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mb: 2 }}>
              <span>Shipping</span>
              <span>Free</span>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, mb: 2 }}>
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </Box>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
            <Button component={Link} to="/products" fullWidth sx={{ mt: 2 }}>Continue Shopping</Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;