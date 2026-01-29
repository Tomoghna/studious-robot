import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  Button,
  Stack,
  Avatar,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PaletteIcon from '@mui/icons-material/Palette';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  // Warm earthy color palette
  const colors = {
    primary: '#8B7355',
    secondary: '#D4A574',
    accent1: '#FF6B6B',
    accent2: '#D4A574',
    accent3: '#C19A6B',
    accent4: '#CD853F',
    light: '#f8f6f1',
    dark: '#3d2817',
  };

  // SVG Background Decorations
  const BrushStrokeSVG = ({ position = 'top' }) => (
    <svg
      width="100%"
      height="200"
      viewBox="0 0 1000 200"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        opacity: 0.08,
        pointerEvents: 'none',
      }}
    >
      <path
        d="M 0 50 Q 250 100, 500 50 T 1000 50"
        stroke={colors.primary}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 0 150 Q 250 50, 500 150 T 1000 150"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  const features = [
    {
      icon: <FormatPaintIcon sx={{ fontSize: 40 }} />,
      title: 'Authentic Creations',
      description: 'Every artwork is personally created with passion, bringing my unique artistic vision to life.',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Delivery',
      description: 'Safe and insured shipping for all artworks. Track your delivery and receive your pieces in perfect condition.',
      color: '#D4A574',
      gradient: 'linear-gradient(135deg, #D4A574 0%, #E8C5A5 100%)',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Payment',
      description: 'Multiple payment options including Razorpay integration for convenient and secure transactions.',
      color: '#C19A6B',
      gradient: 'linear-gradient(135deg, #C19A6B 0%, #D4A574 100%)',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Certified & Authentic',
      description: 'All pieces come with certificates of authenticity, proving they are original creations.',
      color: '#CD853F',
      gradient: 'linear-gradient(135deg, #CD853F 0%, #DAA520 100%)',
    },
  ];

  const stats = [
    { number: '150+', label: 'Artworks', icon: <PaletteIcon />, color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' },
    { number: '3K+', label: 'Happy Collectors', icon: <FavoriteBorderIcon />, color: '#D4A574', gradient: 'linear-gradient(135deg, #D4A574 0%, #E8C5A5 100%)' },
    { number: '12+', label: 'Years Experience', icon: <EmojiEventsIcon />, color: '#C19A6B', gradient: 'linear-gradient(135deg, #C19A6B 0%, #D4A574 100%)' },
    { number: '8', label: 'Awards Won', icon: <EmojiEventsIcon />, color: '#CD853F', gradient: 'linear-gradient(135deg, #CD853F 0%, #DAA520 100%)' },
  ];

  return (
    <Box sx={{ width: '100%', backgroundColor: colors.light, minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, md: 0 },
          background: `linear-gradient(135deg, ${colors.light}, #ffffff)`,
          borderBottom: `3px solid ${colors.secondary}`,
          overflow: 'hidden',
        }}
      >
        <BrushStrokeSVG position="top" />
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  color: colors.dark,
                  mb: 2,
                }}
              >
                About My Art
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  color: colors.primary,
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                Discover Unique Handcrafted Artworks
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  color: colors.dark,
                  mb: 3,
                  lineHeight: 1.8,
                }}
              >
                Welcome to my art studio and gallery. I am a passionate artist dedicated to creating unique,
                hand-crafted artworks that tell stories and inspire emotions. Each piece is a reflection of my
                creative vision and dedication to the artistic craft. Explore my collection and discover a piece
                that resonates with your soul.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/products')}
                sx={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: '#fff',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 24px rgba(139, 115, 85, 0.3)`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Explore Our Collection
              </Button>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <svg width="300" height="300" viewBox="0 0 300 300">
                  {/* Outer frame */}
                  <rect
                    x="20"
                    y="20"
                    width="260"
                    height="260"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="3"
                    rx="10"
                  />
                  <rect
                    x="30"
                    y="30"
                    width="240"
                    height="240"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="1"
                    rx="8"
                    opacity="0.5"
                  />

                  {/* Artistic brush strokes */}
                  <path
                    d="M 50 100 Q 100 80, 150 100 T 250 100"
                    stroke="#FF6B6B"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <path
                    d="M 70 150 Q 120 120, 180 150 T 280 150"
                    stroke={colors.secondary}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <path
                    d="M 40 200 Q 100 180, 160 210 T 270 200"
                    stroke={colors.accent3}
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.8"
                  />

                  {/* Decorative circles */}
                  <circle cx="80" cy="120" r="6" fill="#FF6B6B" opacity="0.6" />
                  <circle cx="150" cy="80" r="5" fill={colors.secondary} opacity="0.6" />
                  <circle cx="220" cy="140" r="7" fill={colors.accent3} opacity="0.6" />
                  <circle cx="100" cy="240" r="5" fill={colors.accent4} opacity="0.6" />
                </svg>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: '#ffffff',
                  border: `2px solid ${colors.secondary}`,
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === index ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredCard === index
                    ? `0 20px 40px rgba(139, 115, 85, 0.15)`
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: stat.gradient,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 1.5,
                    color: stat.color,
                    transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                    mb: 0.5,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500, color: colors.primary }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider
        sx={{
          my: { xs: 4, md: 6 },
          borderColor: colors.secondary,
          opacity: 0.3,
          borderWidth: 2,
        }}
      />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' },
            color: colors.dark,
          }}
        >
          Why Choose Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: colors.primary,
            mb: { xs: 4, md: 6 },
            fontSize: '1.05rem',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          We provide an exceptional experience for both artists and art enthusiasts
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                onMouseEnter={() => setHoveredCard(`feature-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  background: '#ffffff',
                  border: `2px solid ${colors.secondary}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: feature.gradient,
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px rgba(139, 115, 85, 0.15)`,
                    borderColor: feature.color,
                  },
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: feature.gradient,
                      mb: 2,
                      transition: 'transform 0.3s ease',
                      transform: hoveredCard === `feature-${index}` ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                    }}
                  >
                    <Box sx={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      fontSize: '1.1rem',
                      color: colors.dark,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.primary,
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider
        sx={{
          my: { xs: 4, md: 6 },
          borderColor: colors.secondary,
          opacity: 0.3,
          borderWidth: 2,
        }}
      />

      {/* Our Mission Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 0 },
          background: `linear-gradient(135deg, ${colors.light}, #ffffff)`,
          position: 'relative',
          overflow: 'hidden',
          borderTop: `3px solid ${colors.secondary}`,
          borderBottom: `3px solid ${colors.secondary}`,
        }}
      >
        <BrushStrokeSVG position="bottom" />
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5} sx={{ display: { xs: 'flex', md: 'block' }, justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <svg width="280" height="280" viewBox="0 0 280 280">
                  {/* Palette design */}
                  <circle cx="140" cy="140" r="130" fill="none" stroke={colors.primary} strokeWidth="3" />
                  <circle cx="140" cy="140" r="110" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.5" />

                  {/* Color swatches */}
                  <circle cx="100" cy="90" r="15" fill="#FF6B6B" />
                  <circle cx="140" cy="40" r="15" fill={colors.secondary} />
                  <circle cx="180" cy="90" r="15" fill={colors.accent3} />
                  <circle cx="210" cy="140" r="15" fill={colors.accent4} />
                  <circle cx="180" cy="190" r="15" fill="#A29BFE" />
                  <circle cx="140" cy="240" r="15" fill="#FD79A8" />
                  <circle cx="100" cy="190" r="15" fill={colors.secondary} />
                  <circle cx="70" cy="140" r="15" fill={colors.primary} />

                  {/* Center brush */}
                  <circle cx="140" cy="140" r="12" fill={colors.primary} />
                </svg>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: colors.dark,
                }}
              >
                My Artistic Journey
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.05rem',
                  lineHeight: 1.9,
                  mb: 2.5,
                  color: colors.dark,
                }}
              >
                My passion lies in creating meaningful artwork that connects people with emotions and experiences.
                Each piece is a labor of love, crafted with dedication and artistic vision. I believe art is a
                universal language that transcends boundaries.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.05rem',
                  lineHeight: 1.9,
                  color: colors.dark,
                }}
              >
                Through my work, I aim to inspire, provoke thought, and create moments of beauty in your everyday
                life. Each artwork tells a unique story and represents a specific moment in my creative evolution.
                I'm grateful to share my creations with collectors who appreciate and cherish them.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/contact')}
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    color: '#fff',
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 24px rgba(139, 115, 85, 0.3)`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Contact Us
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: 2,
                    border: '2px solid',
                    '&:hover': {
                      background: `${colors.primary}15`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Shop Now
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* Call to Action Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 0 },
          background: `linear-gradient(135deg, ${colors.light}, #ffffff)`,
          position: 'relative',
          textAlign: 'center',
          borderTop: `3px solid ${colors.secondary}`,
          borderBottom: `3px solid ${colors.secondary}`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              color: colors.dark,
            }}
          >
            Discover My Latest Creations
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              color: colors.primary,
              mb: 4,
              lineHeight: 1.8,
            }}
          >
            Explore my collection of handcrafted artworks and find the perfect piece for your collection.
            Each artwork comes with a certificate of authenticity and is ready to inspire your space.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 24px rgba(139, 115, 85, 0.3)`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Shopping
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                border: '2px solid',
                '&:hover': {
                  background: `${colors.primary}15`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get in Touch
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
