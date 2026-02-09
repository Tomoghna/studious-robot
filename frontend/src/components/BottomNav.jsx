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
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import { getAvatarFromEmail } from '../utils/getAvatarFromEmail';
import Avatar from '@mui/material/Avatar';
import Badge from "@mui/material/Badge";

export default function BottomNav() {
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const { getCartItemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [value, setValue] = React.useState(0);

  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

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
        <BottomNavigationAction label="Wishlist" icon={<Badge badgeContent={wishlistItems?.length || 0} color="secondary"><FavoriteIcon /></Badge>} onClick={() => navigate('/wishlist')} />
        <BottomNavigationAction label="Cart" icon={<Badge badgeContent={getCartItemCount() || 0} color="success"><ShoppingCartIcon /></Badge>} onClick={() => navigate('/cart')} />
        <BottomNavigationAction label="Account" icon={user ? ( <Avatar src={getAvatarFromEmail(user.email)} sx={{ width: 24, height: 24 }} /> ) : ( <AccountCircleIcon /> )} onClick={() => { if (!user) { setIsLoginModalOpen(true); } else { navigate('/LoginPage')}}} />
      </BottomNavigation>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}/>
    </Paper>
  );
}
