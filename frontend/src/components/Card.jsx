import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';

import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({product}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        let interval;
        if(isHovered) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, product.images.length]);

    const handleWishlistToggle = (e) => {
        e.preventDefault(); // Prevent card navigation
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const isWishlisted = isInWishlist(product.id);

    const renderRating = (rating = 4.5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {[...Array(fullStars)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: 'warning.main', fontSize: 16 }} />
                ))}
                {hasHalfStar && <StarHalfIcon sx={{ color: 'warning.main', fontSize: 16 }} />}
                <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>({rating})</Typography>
            </Box>
        );
    };

    return (
        <Card sx={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Box sx={{ position: 'relative' }}>
                <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
                    <CardMedia
                        component="img"
                        image={product.images[currentImageIndex]}
                        alt={product.name}
                        sx={{ objectFit: 'contain', height: 200, p: 1, bgcolor: 'background.paper' }}
                    />
                </Link>
                {product.isNew && (
                    <Chip label="New" color="error" size="small" sx={{ position: 'absolute', top: 8, left: 8 }} />
                )}
                <IconButton onClick={handleWishlistToggle} aria-label="toggle wishlist" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: isWishlisted ? 'error.main' : 'background.paper' }}>
                    <FavoriteIcon sx={{ color: isWishlisted ? '#fff' : 'inherit' }} />
                </IconButton>
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {product.name}
                    </Typography>
                </Link>
                <Box sx={{ mb: 1 }}>{renderRating(product.rating)}</Box>
                <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>${product.price}</Typography>
            </CardContent>

            <CardActions>
                <Button size="small" variant="contained" color="primary" component={Link} to={`/product/${product.id}`} sx={{ flex: 1 }}>Buy Now</Button>
                <Button size="small" variant="outlined" onClick={handleAddToCart} sx={{ flex: 1 }}>Add to Bag</Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;