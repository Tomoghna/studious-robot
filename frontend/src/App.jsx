import React, { useContext, Suspense, lazy } from 'react'
import { Link as RouterLink } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { useCategories } from "./contexts/CategoryContext";
import { Box, Container, Typography, Card, CardMedia, CardContent, Link as MuiLink, useTheme, useMediaQuery } from "@mui/material";
import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import SearchResults from "./components/SearchResults";
import RequireAdmin from "./components/RequireAdmin";
import BackToTop from "./components/BackToTop";
import BottomNav from "./components/BottomNav";
import { Skeleton, Fade, Button } from "@mui/material";

const Products = lazy(() => import("./components/Products"));
const Wishlist = lazy(() => import("./components/Wishlist"));
const Cart = lazy(() => import("./components/Cart"));
const AboutUs6 = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { categories, loading: loadingCategories, error, refreshCategories } = useCategories();

  const images = [
    "/products/product-1.jpg",
    "/products/product-2.jpg",
    "/products/product-3.jpg",
  ];

  const PageSkeleton = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      
      {/* Hero / Banner Skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: { xs: 180, sm: 250, md: 350 },
          borderRadius: 2,
          mb: 4
        }}
      />

      <Container maxWidth="lg">

        {/* Section Title Skeleton */}
        <Skeleton
          variant="text"
          width="40%"
          height={50}
          sx={{ mb: 3 }}
        />

        {/* Product Grid Skeleton */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {Array.from(new Array(8)).map((_, index) => (
            <Card key={index} sx={{ borderRadius: 3 }}>
              <Skeleton
                variant="rectangular"
                sx={{
                  height: 180,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />
              <CardContent>
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          ))}
        </Box>

      </Container>
    </Box>
  );
};


  return (
    <ProductProvider>
      <WishlistProvider>
        <CartProvider>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Router>
              <Navbar />
              {/* Global horizontal margin wrapper */}
              <Box sx={{ px: { xs: 2, md: 4, lg: 8 } }}>

                <Routes>
                  <Route
                    path="/"
                    element={
                      <main>
                        <Banner />
                        <Container maxWidth="lg" sx={{ py: 4 }}>
                          {/* Hero Carousel */}
                          <Box sx={{ my: 4 }}>
                            <Carousel images={images} />
                          </Box>

                          {/* Categories */}
                          <Box sx={{ my: 6 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
                              Shop by Categories
                            </Typography>
                            <Box sx={{ p: 2, bgcolor: 'rgb(107, 114, 128)', borderRadius: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                              {loadingCategories &&
                                Array.from(new Array(4)).map((_, index) => (
                                  <Card
                                    key={index}
                                    sx={{ width: 150, bgcolor: "background.paper" }}
                                  >
                                    <Skeleton variant="rectangular" height={150} />
                                    <CardContent>
                                      <Skeleton variant="text" width="80%" />
                                      <Skeleton variant="text" width="40%" />
                                    </CardContent>
                                  </Card>
                                ))}

                              {!loadingCategories && (error || categories.length === 0) && (
                                <Box sx={{ width: "100%", textAlign: "center", color: "white", }}>
                                  <Typography
                                    variant="body1"
                                    sx={{ color: "white", textAlign: "center", width: "100%" }}
                                  >
                                    No categories available at the time.
                                  </Typography>

                                  {error && (
                                    <Button variant="contained" color="primary" onClick={refreshCategories} disabled={loadingCategories}>{loadingCategories ? "Retrying..." : "Retry"}</Button>
                                  )}
                                </Box>
                              )}

                              {!loadingCategories && !error && categories.length > 0 &&
                                categories.map((category) => (
                                  <Fade in={!loadingCategories} timeout={600} key={category.id}>
                                    <MuiLink component={RouterLink} to={`/products?category=${category?.category?.replace(' ', '-')}`} sx={{ textDecoration: 'none' }} key={category.id}>
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
                                          alt={category.category}
                                          sx={{
                                            aspectRatio: '1/1',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease-in-out',
                                            height: '150px'
                                          }}
                                        />
                                        <CardContent sx={{ textAlign: 'center' }}>
                                          <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 600, mb: 0.5 }}
                                          >
                                            {category.category}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="textSecondary">
                                            {category.totalCount} items
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    </MuiLink>
                                  </Fade>
                                ))}
                            </Box>
                          </Box>
                        </Container>
                      </main>
                    }
                  />
                  <Route path="/products" element={<Suspense fallback={<PageSkeleton />}><Products /></Suspense>} />
                  <Route path="/product/:id" element={<Suspense fallback={<PageSkeleton />}><ProductDetail /></Suspense>} />
                  <Route path="/cart" element={<Suspense fallback={<PageSkeleton />}><Cart /></Suspense>} />
                  <Route path="/wishlist" element={<Suspense fallback={<PageSkeleton />}><Wishlist /></Suspense>} />
                  <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><AboutUs6 /></Suspense>} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><Contact /></Suspense>} />
                  <Route path="/LoginPage" element={<Suspense fallback={<PageSkeleton />}><LoginPage /></Suspense>} />
                  <Route path="/admin" element={<RequireAdmin><Suspense fallback={<PageSkeleton />}><AdminPage /></Suspense></RequireAdmin>} />
                  <Route path="/checkout" element={<Suspense fallback={<PageSkeleton />}><CheckoutPage /></Suspense>} />
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
