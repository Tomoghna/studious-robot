import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Carousel from "./Carousel";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAlert } from "../contexts/AlertContext";
import { useAuthModal } from "../contexts/AuthModalContext";
import { CircularProgress } from "@mui/material";
import api from "../utils/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });

  // Reviews state (start from product.reviews if available)
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { fetchUser, user } = useAuth();
  const { openLogin } = useAuthModal();
  const { showSnackbar } = useSnackbar();
  const { showAlert } = useAlert();

  async function fetchProductById() {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/users/product/${id}`);
      if (res.status === 200) {
        setProduct(res.data?.data);
        setReviews(res.data?.data.reviews || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProductById();
  }, [id]);

  if(loading){
    return(
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Product not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The product you're looking for doesn't exist.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/products")}>
          Return to Products
        </Button>
      </Container>
    );
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddReview = () => {
    if (!reviewText.trim()) return;
    if(!user){
      openLogin();
      showAlert("Please login to add a review", "info", 2000);
      return;
    }
    (async () => {
      try {
        const payload = {
          name: user?.name || "",
          rating: reviewRating,
          comment: reviewText,
        };
        const res = await api.post(`/api/v1/users/givereview/${product._id}`, payload );
        if (res.status === 200) {
          setReviews((prev) => [
            {
              _id: Date.now().toString(),
              name: payload.name,
              rating: payload.rating,
              text: payload.comment,
              date: new Date().toISOString(),
            },
            ...prev,
          ]);
          setReviewName("");
          setReviewRating(0);
          setReviewText("");
          showSnackbar(res.data?.message || "Review added", {severity: "success"});
          fetchProductById();
          // optionally refresh product/user
        } else {
          setReviewName("");
          setReviewRating(0);
          setReviewText("");
          showSnackbar(res.data?.message || "Failed to add review", {severity: "error"});
        }
      } catch (err) {
        console.error(err);
        showSnackbar(err.message || "Network error", {severity: "error"});
      }
    })();
  };

  const handleUpdateReview = async (rating, comment) => {
    try {
      const res = await api.patch(`/api/v1/users/updatereview/${product._id || product.id}`,{ rating, comment });
      if (res.status === 200) {
        showSnackbar(res.data?.message || "Review updated", "success");
        // Update local list if necessary; here we will simply refetch user/product in real app
      } else {
        showSnackbar(res.data?.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || "Network error", "error");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ overflow: "hidden" }}>
            <Carousel images={product.images} currentIndex={currentImageIndex} onIndexChange={setCurrentImageIndex} onImageClick={(index) => { setZoomImageIndex(index); setZoomOpen(true); }} />
          </Paper>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {product?.images?.map((image, index) => (
              <Grid key={index} item xs={3}>
                <Button
                  sx={{ p: 0, minWidth: 0 }}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`${product.name} thumb ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 1,
                      border: index === currentImageIndex ? '2px solid #1976d2' : 'none',
                    }}
                  />
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {product.name}
              </Typography>
              <IconButton
                onClick={toggleWishlist}
                color={isInWishlist(product._id) ? "error" : "default"}
              >
                <FavoriteIcon />
              </IconButton>
            </Box>

            {product.isNew && <Chip label="New" color="error" sx={{ mt: 1 }} />}

            <Typography variant="h5" color="success.main" sx={{ mt: 2, mb: 2 }}>
              ₹{product.price}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Category:
              </Typography>
              <Typography>{product?.category.category.replace("-", " ")}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                -
              </Button>
              <Box sx={{ width: 64, textAlign: "center" }}>{quantity}</Box>
              <Button
                variant="outlined"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button variant="contained" onClick={handleBuyNow} fullWidth>
                Buy Now: ₹{(product.price * quantity).toFixed(2)}
              </Button>
              <Button variant="outlined" onClick={handleAddToCart} fullWidth>
                Add to Cart
              </Button>
            </Box>
          </Paper>
{/*
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Materials
            </Typography>
            <Typography>Handcrafted bamboo, natural dyes</Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Dimensions
            </Typography>
            <Typography>Height: 12 inches, Width: 8 inches</Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Care Instructions
            </Typography>
            <Typography>Clean with dry cloth, avoid direct sunlight</Typography>
          </Paper>
*/}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reviews ({reviews.length})
            </Typography>

            {user ? (
              <Stack spacing={2} sx={{ mb: 2 }}>
                <TextField
                  label="Name"
                  value={user.name}
                  fullWidth
                />
                <Rating
                  value={reviewRating || 0}
                  onChange={(e, v) => setReviewRating(v || 0)}
                />
                <TextField
                  label="Review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <Button variant="contained" onClick={handleAddReview}>
                  Add Review
                </Button>
              </Stack>
            ) : (
              <Button onClick={openLogin} color="primary" variant="outlined">Please Log In to add a review</Button>
            )}

            <Divider sx={{ mb: 2 }} />

            {reviews.length === 0 ? (
              <Typography color="text.secondary">
                No reviews yet. Be the first to review this product.
              </Typography>
            ) : (
              <List>
                {reviews.map((r) => (
                  <React.Fragment key={r._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          {r.name ? r.name[0].toUpperCase() : "?"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>
                              {r.name}
                            </Typography>
                            <Rating value={r.rating} size="small" readOnly />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(r.ratedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography sx={{ whiteSpace: "pre-wrap" }}>
                            {r.comment}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog 
        open={zoomOpen} 
        onClose={() => { setZoomOpen(false); setZoomLevel(1); setPanX(0); setPanY(0); }} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'black', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <IconButton
            onClick={() => { setZoomOpen(false); setZoomLevel(1); setPanX(0); setPanY(0); }}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Main Image View */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh',
              overflow: 'hidden',
              cursor: isPanning ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'zoom-in'),
              position: 'relative',
              touchAction: 'none'
            }}
            onClick={() => zoomLevel === 1 && setZoomLevel(2)}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.1 : 0.1;
              setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
            }}
            onMouseDown={(e) => {
              if (zoomLevel > 1) {
                setIsPanning(true);
                setLastPan({ x: e.clientX - panX, y: e.clientY - panY });
              }
            }}
            onMouseMove={(e) => {
              if (isPanning && zoomLevel > 1) {
                setPanX(e.clientX - lastPan.x);
                setPanY(e.clientY - lastPan.y);
              }
            }}
            onMouseUp={() => setIsPanning(false)}
            onMouseLeave={() => setIsPanning(false)}
            onTouchStart={(e) => {
              if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                  touch1.clientX - touch2.clientX,
                  touch1.clientY - touch2.clientY
                );
                setLastPan({ x: distance, y: 0 });
              } else if (e.touches.length === 1) {
                const touch = e.touches[0];
                if (zoomLevel > 1) {
                  setIsPanning(true);
                  setLastPan({ x: touch.clientX - panX, y: touch.clientY - panY });
                }
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                  touch1.clientX - touch2.clientX,
                  touch1.clientY - touch2.clientY
                );
                const lastDistance = lastPan.x;
                const scale = distance / lastDistance;
                setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * scale)));
                setLastPan({ x: distance, y: 0 });
              } else if (e.touches.length === 1 && isPanning && zoomLevel > 1) {
                e.preventDefault();
                const touch = e.touches[0];
                setPanX(touch.clientX - lastPan.x);
                setPanY(touch.clientY - lastPan.y);
              }
            }}
            onTouchEnd={() => setIsPanning(false)}
          >
            <Box
              component="img"
              src={product?.images?.[zoomImageIndex]}
              alt={`${product?.name} zoom`}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
                transition: isPanning ? 'none' : 'transform 0.2s ease'
              }}
            />
          </Box>

          {/* Thumbnail Navigation */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              overflowX: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255,255,255,0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '3px',
              },
            }}
          >
            {product?.images?.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`thumbnail ${index + 1}`}
                onClick={() => {
                  setZoomImageIndex(index);
                  setZoomLevel(1);
                  setPanX(0);
                  setPanY(0);
                }}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: index === zoomImageIndex ? '2px solid #fff' : '2px solid transparent',
                  opacity: index === zoomImageIndex ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  '&:hover': {
                    opacity: 1,
                  }
                }}
              />
            ))}
          </Box>

          {/* Zoom Info */}
          <Typography
            sx={{
              position: 'absolute',
              bottom: 80,
              left: 16,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875rem'
            }}
          >
            {(zoomLevel * 100).toFixed(0)}%
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
