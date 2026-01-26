import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { useCategories } from "./contexts/CategoryContext";
import {Box, Container, Typography, Card, CardMedia, CardContent, Link as  MuiLink, useTheme, useMediaQuery} from "@mui/material";
import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Cart from "./components/Cart";
import AboutUs6 from "./components/About";
import Contact from "./components/Contact";
import SearchResults from "./components/SearchResults";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Wishlist from "./components/Wishlist";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import RequireAdmin from "./components/RequireAdmin";
import BackToTop from "./components/BackToTop";
import CheckoutPage from "./pages/CheckoutPage";
import BottomNav from "./components/BottomNav";

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { categories, loading: loadingCategories } = useCategories();

  const images = [
    "/products/product-1.jpg",
    "/products/product-2.jpg",
    "/products/product-3.jpg",
  ];

  return (
    <ProductProvider>
      <WishlistProvider>
        <CartProvider>
          <Box sx={{minHeight: '100vh', bgcolor: 'background.default'}}>
            <Router>
              <Navbar />
              {/* Global horizontal margin wrapper */}
              <Box sx={{px: {xs: 2, md: 4, lg: 8}}}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <main>
                      <Banner />
                      <Container maxWidth="lg" sx={{py: 4}}>
                        {/* Hero Carousel */}
                        <Box sx={{my: 4}}>
                          <Carousel images={images} />
                        </Box>

                        {/* Categories */}
                        <Box sx={{my: 6}}>
                          <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', mb: 4}}>
                            Shop by Categories
                          </Typography>
                          <Box sx={{p: 2, bgcolor: 'rgb(107, 114, 128)', borderRadius: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center'}}>
                            {categories.map((category) => (
                              <MuiLink href={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`} sx={{textDecoration: 'none'}} key={category.id}>
                                <Card sx={{
                                  bgcolor: 'background.paper',
                                  transition: 'transform 0.3s ease-in-out',
                                  width: '150px',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    '& img': {
                                      transform: 'scale(1.1)'
                                    }
                                  }
                                }}
                                >
                                  <CardMedia
                                    component="img"
                                    image={category.image}
                                    alt={category.name}
                                    sx={{
                                      aspectRatio: '1/1',
                                      objectFit: 'cover',
                                      transition: 'transform 0.3s ease-in-out',
                                      height: '150px'
                                    }}
                                  />
                                  <CardContent sx={{ textAlign: 'center'}}>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{fontWeight: 600, mb: 0.5}}
                                    >
                                      {category.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary">
                                        {category.count} items
                                      </Typography>
                                  </CardContent>
                                </Card>
                              </MuiLink>
                            ))}
                          </Box>
                        </Box>
                      </Container>
                    </main>
                  }
                />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/about" element={<AboutUs6 />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/LoginPage" element={<LoginPage/>} />
                <Route path="/admin" element={<RequireAdmin><AdminPage/></RequireAdmin>} />
                <Route path="/checkout" element={<CheckoutPage/>} />
              </Routes>

              <BottomNav />
              </Box>
              <BackToTop />
            </Router>
          </Box>
        </CartProvider>
      </WishlistProvider>
    </ProductProvider>
  );
};
