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
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";
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

  // Reviews state (start from product.reviews if available)
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { fetchUser, user } = useAuth();
  const { openLogin } = useAuthModal();
  const { showSnackbar } = useSnackbar();

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
          showSnackbar(res.data?.message || "Review added", "success");
          fetchProductById();
          // optionally refresh product/user
        } else {
          setReviewName("");
          setReviewRating(0);
          setReviewText("");
          showSnackbar(res.data?.message || "Failed to add review", "error");
        }
      } catch (err) {
        console.error(err);
        showSnackbar(err.message || "Network error", "error");
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
            <Carousel images={product.images} autoplayInterval={4000} />
          </Paper>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {product?.images?.map((image, index) => (
              <Grid key={index} item xs={3}>
                <Button
                  sx={{ p: 0, minWidth: 0 }}
                  onClick={() => {
                    /* thumbnail click: could set carousel index */
                  }}
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
              ${product.price}
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
                Buy Now: ${(product.price * quantity).toFixed(2)}
              </Button>
              <Button variant="outlined" onClick={handleAddToCart} fullWidth>
                Add to Cart
              </Button>
            </Box>
          </Paper>

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

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reviews ({reviews.length})
            </Typography>

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
    </Container>
  );
}
