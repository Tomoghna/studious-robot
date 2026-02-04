import React, {useState, useEffect} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import CircularProgress from "@mui/material/CircularProgress";

import { useProducts } from "../contexts/ProductContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { UseThemeMode } from "../contexts/ThemeContext";
import { useCategories } from "../contexts/CategoryContext";
import LoginModal from "./LoginModal";

const API_URL = import.meta.env.VITE_SERVER_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchProducts, searchQuery } = useProducts();
  const { wishlistItems } = useWishlist();
  const { getCartItemCount } = useCart();
  const { mode, toggleTheme } = UseThemeMode();
  const {categories, loading, error} = useCategories();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleCategoryClick = (categoryName) => {
    setMobileOpen(false);
    navigate(`/products?category=${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const drawer = (
    <Box sx={{ width: 260 }} role="presentation" onClick={() => setMobileOpen(false)}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/products">
            <ListItemIcon>
              <Inventory2Icon/>
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setCategoriesOpen(!categoriesOpen)}>
            <ListItemIcon>
              <CategoryIcon/>
            </ListItemIcon>
            <ListItemText primary="Categories" />
            {categoriesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {loading ? (
              <ListItem sx={{ pl: 4, justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </ListItem>
            ) : error ? (
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary="Failed to load categories" secondary={error} />
              </ListItem>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <ListItem key={category._id} disablePadding sx={{ pl: 4 }}>
                  <ListItemButton onClick={() => handleCategoryClick(category.name)}>
                    <ListItemText primary={category.name} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary="No categories available" />
              </ListItem>
            )}
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/wishlist">
            <Badge badgeContent={wishlistItems?.length || 0} color="primary">
              <FavoriteIcon/>
            </Badge>
            <ListItemText primary="wishlist"/>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/cart">
            <Badge badgeContent={getCartItemCount() || 0} color="primary">
              <ShoppingCartIcon/>
            </Badge>
            <ListItemText primary="Cart"/>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/about">
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/contact">
            <ListItemText primary="Contact" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>{user ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.avatar} alt={user.name} />
          <Box>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2">Not signed in</Typography>
          <Box sx={{ mt: 1 }}>
            <ListItemButton onClick={() => setIsLoginModalOpen(true)}>Sign in / Register</ListItemButton>
          </Box>
        </Box>
      )}</Box>
      {user && (
        <Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={async (e) => { e.stopPropagation(); setMobileOpen(false); try { await logout(); navigate('/'); } catch(err) { console.error(err); } }}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography component={Link} to="/" variant="h6" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 800 }}>
            MAYUR HAMSA
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* wishlist and cart removed from top navbar per migration to MUI BottomNav */}

          <IconButton color="inherit" onClick={() => { if (!user) { setIsLoginModalOpen(true); } else { navigate(user.role === 'admin' ? '/admin' : '/account'); } }} aria-label="account">
            {user ? <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} /> : <AccountCircle />}
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {drawer}
      </Drawer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </AppBar>
  );
};

export default Navbar;