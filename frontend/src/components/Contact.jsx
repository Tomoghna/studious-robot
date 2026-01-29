import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Contact = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const contactMethods = [
    {
      id: 'email',
      title: 'Email Us',
      description: 'Send us your inquiries and feedback',
      contact: 'contact@artshop.com',
      icon: EmailIcon,
      action: () => window.location.href = 'mailto:contact@artshop.com',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp for quick responses',
      contact: '+91 98765 43210',
      icon: WhatsAppIcon,
      action: () => window.open('https://wa.me/919876543210', '_blank'),
      color: '#25D366',
      gradient: 'linear-gradient(135deg, #25D366 0%, #5FE5A8 100%)'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f6f1', py: 8 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
          {/* Decorative SVG */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{ margin: '0 auto 20px', opacity: 0.15 }}
          >
            <circle cx="60" cy="60" r="50" fill="none" stroke="#8B7355" strokeWidth="2" />
            <path
              d="M 60 30 Q 75 45 75 60 Q 75 75 60 90 Q 45 75 45 60 Q 45 45 60 30"
              fill="#8B7355"
            />
            <circle cx="60" cy="60" r="8" fill="#f8f6f1" />
          </svg>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#3d2817',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#8B7355',
              fontWeight: 300,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Have questions about our artwork? We'd love to hear from you. Reach out through any of these channels.
          </Typography>
        </Box>

        {/* Contact Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' },
            gap: 4,
            mb: 8
          }}
        >
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Paper
                key={method.id}
                onMouseEnter={() => setHoveredCard(method.id)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  p: 5,
                  borderRadius: 3,
                  background: '#ffffff',
                  border: '2px solid #e8dcc8',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  transform: hoveredCard === method.id ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredCard === method.id
                    ? '0 20px 40px rgba(139, 115, 85, 0.15)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background gradient on hover */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: method.gradient,
                    opacity: hoveredCard === method.id ? 0.08 : 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none'
                  }}
                />

                {/* Icon Container */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: method.gradient,
                    mb: 3,
                    transition: 'transform 0.4s ease',
                    transform: hoveredCard === method.id ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Icon sx={{ fontSize: 36, color: '#fff' }} />
                </Box>

                {/* Content */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#3d2817',
                    mb: 1,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {method.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#8B7355',
                    mb: 2.5,
                    lineHeight: 1.6,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {method.description}
                </Typography>

                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: method.color,
                    mb: 2.5,
                    letterSpacing: 0.5,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {method.contact}
                </Typography>

                {/* Divider */}
                <Box
                  sx={{
                    width: '40px',
                    height: '3px',
                    background: method.gradient,
                    mb: 3,
                    borderRadius: '2px',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'width 0.4s ease',
                    ...(hoveredCard === method.id && { width: '60px' })
                  }}
                />

                {/* Action Button */}
                <Button
                  onClick={method.action}
                  sx={{
                    background: method.gradient,
                    color: '#fff',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    fontSize: '0.95rem',
                    py: 1.2,
                    px: 3,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredCard === method.id ? `0 8px 20px ${method.color}40` : 'none',
                    position: 'relative',
                    zIndex: 1,
                    '&:hover': {
                      boxShadow: `0 12px 24px ${method.color}60`,
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Get In Touch
                </Button>

                {/* Decorative corner element */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: method.gradient,
                    opacity: 0.1,
                    transition: 'opacity 0.4s ease',
                    ...(hoveredCard === method.id && { opacity: 0.15 })
                  }}
                />
              </Paper>
            );
          })}
        </Box>

        {/* Footer SVG Decoration */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#8B7355',
                  opacity: 0.3
                }}
              />
            ))}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#8B7355',
              fontStyle: 'italic',
              fontSize: '0.9rem'
            }}
          >
            We usually respond within 24 hours • Support hours: 9 AM - 6 PM IST
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;