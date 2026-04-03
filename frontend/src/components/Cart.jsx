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
import { CircularProgress } from "@mui/material";

const Cart = () => {
  const { cartItems, updateQuantity, getCartTotal, removeItemCart, getCartItemCount, isLoading} = useCart();
  const navigate = useNavigate();
  
  if(isLoading){
    return(
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isLoading &&  cartItems.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }} gutterBottom>Your cart is empty</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Looks like you haven't added any items yet</Typography>
          <Button component={Link} to="/products" variant="contained" color="primary">Continue Shopping</Button>
        </Box>
      </Box>
    );
  }
  return (
    <Container sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 2 }}>
        Shopping Cart ({getCartItemCount()} items)
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 4 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cartItems.map((item) => (
              <Paper key={item._id} sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}>
                  <Link to={`/product/${item._id}`} style={{ flexShrink: 0, minWidth: 120 }}>
                    <img src={item.images[0]} alt={item.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                  </Link>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Typography>
                    </Link>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, whiteSpace: 'nowrap' }}>Price: ₹{item.price}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: { xs: 1, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.paper', borderRadius: 1, p: '2px 6px' }}>
                    <IconButton size="small" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</IconButton>
                    <Typography sx={{ width: 32, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' }, mt: { xs: 0, sm: 1 } }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                  <Button color="error" size="small" onClick={() => removeItemCart(item._id)}>Remove</Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} gutterBottom>Order Summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              <span>Subtotal</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              <span>Shipping</span>
              <span>Free</span>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, mb: 2, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
              <span>Total</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
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