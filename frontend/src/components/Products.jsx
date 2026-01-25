import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useSearchParams } from 'react-router-dom';
import Pagination from './Pagination';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Drawer,
  Chip,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
  Slider,
  InputAdornment,
  Toolbar,
  AppBar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const ProductCard = lazy(() => import("./Card"));


const ProductCardSkeleton = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: {
        xs: "240px",
        sm: "280px",
        md: "320px",
        lg: "360px",
      },
      bgcolor: "grey.200",
      borderRadius: 1,
      animation: "pulse 1.5s ease-in-out infinite",
      "@keyframes pulse" : {
        "0%" : {opacity: 1},
        "50%" : {opacity: 0.5},
        "100%" : {opacity: 1},
      },
    }}
  />
);

// Utility function for debouncing
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const CATEGORIES = [
  { id: 'paintings', name: 'Paintings' },
  { id: 'incense-boxes', name: 'Incense Boxes' },
  { id: 'incense-holders', name: 'Incense Holders' },
  { id: 'pots', name: 'Pots' },
  { id: 'wall-alters', name: 'Wall Alters' },
];

const ITEMS_PER_PAGE = 12;

const PriceFilter = ({ priceRange, onChange }) => {
  const [localRange, setLocalRange] = useState(priceRange);
  const theme = useTheme();

  const debouncedOnChange = useCallback(
    debounce((value) => {
      const validRange = {
        min: Math.min(value.min, value.max),
        max: Math.max(value.min, value.max)
      };
      onChange(validRange);
    }, 300),
    [onChange]
  );

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  const handleSliderChange = (event, newValue) => {
    const newRange = {
      min: newValue[0],
      max: newValue[1]
    };
    setLocalRange(newRange);
    debouncedOnChange(newRange);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Price Range
      </Typography>
      <Slider
        value={[localRange.min, localRange.max]}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => formatPrice(value)}
        min={0}
        max={1000}
        step={10}
        sx={{
          mb: 2,
          '& .MuiSlider-thumb': {
            '&:hover': {
              boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
            },
          },
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextField
          type="number"
          label="Min"
          size="small"
          value={localRange.min}
          onChange={(e) => {
            const newRange = { ...localRange, min: parseInt(e.target.value) || 0 };
            setLocalRange(newRange);
            debouncedOnChange(newRange);
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          type="number"
          label="Max"
          size="small"
          value={localRange.max}
          onChange={(e) => {
            const newRange = { ...localRange, max: parseInt(e.target.value) || 1000 };
            setLocalRange(newRange);
            debouncedOnChange(newRange);
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Stack>
    </Box>
  );
};

export default function Products() {
  const { products } = useProducts();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [searchText, setSearchText] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Initialize selected categories from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
    setCurrentPage(1);
  }, [searchParams]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      let newCategories;
      if (prev.includes(categoryId)) {
        newCategories = prev.filter(id => id !== categoryId);
      } else {
        newCategories = [...prev, categoryId];
      }
      // Update URL params
      if (newCategories.length > 0) {
        setSearchParams({ category: newCategories[0] });
      } else {
        setSearchParams({});
      }
      return newCategories;
    });
    setCurrentPage(1);
  };

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  const hasActiveFilters = () => {
    return selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 1000;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchText.trim() === '' || product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategories.length > 0
      ? selectedCategories.includes(product.category)
      : true;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchParams({});
    setPriceRange({ min: 0, max: 1000 });
    setCurrentPage(1);
  };

  const FilterPanel = () => (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
        boxShadow: theme.palette.mode === 'dark' ? '0px 2px 8px rgba(0,0,0,0.3)' : 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
        {hasActiveFilters() && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            variant="text"
            color="primary"
          >
            Clear
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Categories
        </Typography>
        <Stack spacing={1}>
          {CATEGORIES.map(category => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  color="primary"
                />
              }
              label={category.name}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.95rem',
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />
      <PriceFilter priceRange={priceRange} onChange={handlePriceChange} />
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, sm: 4, md: 6 }, px: { xs: 1, sm: 2 } }}>
      {/* Mobile Filter Toolbar */}
      {isMobile && (
        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={() => setMobileDrawerOpen(true)}
            sx={{
              py: 1.2,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Show Filters {hasActiveFilters() && `(${selectedCategories.length + (priceRange.min > 0 || priceRange.max < 1000 ? 1 : 0)})`}
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: { xs: 0, md: 3 } }}>
        {/* Sidebar - Hidden on Mobile */}
        {!isMobile && (
          <Box
            sx={{
              width: { md: '280px', lg: '300px' },
              flexShrink: 0,
              position: 'sticky',
              top: 100,
              height: 'fit-content',
            }}
          >
            <FilterPanel />
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: '300px',
            },
          }}
        >
          <Box sx={{ p: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Filters
              </Typography>
              <IconButton
                onClick={() => setMobileDrawerOpen(false)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FilterPanel />
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, width: { xs: '100%', md: 'calc(100% - 300px)' } }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(135deg, primary.main, secondary.main)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {selectedCategories.length > 0
                ? CATEGORIES.find(cat => cat.id === selectedCategories[0])?.name || 'Products'
                : 'All Products'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Showing {filteredProducts.length === 0 ? 0 : Math.min(startIndex + 1, filteredProducts.length)}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
            </Typography>

            {/* Search Bar */}
            <TextField
              fullWidth={isMobile}
              sx={{ maxWidth: isMobile ? '100%' : '400px' }}
              placeholder="Search products..."
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                  mb: 4,
                }}
              >
                {paginatedProducts.map((product) => (
                  <Suspense key={product.id} fallback={<ProductCardSkeleton/>}>
                    <Box
                      key={product.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        minHeight: {
                          xs: '240px',
                          sm: '280px',
                          md: '320px',
                          lg: '360px',
                        },
                      }}
                    >
                      <ProductCard product={product} />
                    </Box>
                  </Suspense>
                ))}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              )}
            </>
          ) : (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
              }}
            >
              <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                No products found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Try adjusting your filters or search terms
              </Typography>
              <Button
                variant="contained"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}