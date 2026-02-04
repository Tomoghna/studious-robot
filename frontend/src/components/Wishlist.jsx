import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from './Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>Your wishlist is empty</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Save your favorite items to your wishlist</Typography>
          <Button component={Link} to="/products" variant="contained" color="primary">Browse Products</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Wishlist ({wishlistItems.length} items)</Typography>
      <Grid container spacing={3}>
        {wishlistItems.map(product => (
          <Grid key={product.id} item xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}