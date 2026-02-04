import React from 'react';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [value, setValue] = React.useState(0);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { md: 'none' } }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} onClick={() => navigate('/')} />
        <BottomNavigationAction label="Products" icon={<StorefrontIcon />} onClick={() => navigate('/products')} />
        <BottomNavigationAction label="Wishlist" icon={<FavoriteIcon />} onClick={() => navigate('/wishlist')} />
        <BottomNavigationAction label="Cart" icon={<ShoppingCartIcon />} onClick={() => navigate('/cart')} />
        <BottomNavigationAction label="Account" icon={<AccountCircleIcon />} onClick={() => navigate('/LoginPage')} />
      </BottomNavigation>
    </Paper>
  );
}
