import React, { useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, CardActions,  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,Snackbar, Alert, Box } from '@mui/material';
import { CreditCard, CheckCircle, Star, StarBorder, Payment as PaymentIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styles from '../styles/pages/Payment.module.css';

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const plans = [
    {
      title: 'Basic',
      price: '₹499',
      duration: '1 Month',
      features: [
        'Access to basic quizzes',
        'Limited question bank',
        'Basic performance tracking',
        'Email support'
      ]
    },
    {
      title: 'Premium',
      price: '₹999',
      duration: '3 Months',
      features: [
        'Access to all quizzes',
        'Full question bank',
        'Advanced analytics',
        'Priority support',
        'Detailed explanations'
      ]
    },
    {
      title: 'Pro',
      price: '₹1999',
      duration: '1 Year',
      features: [
        'Everything in Premium',
        'Custom quiz creation',
        'AI-powered recommendations',
        '24/7 support',
        'Group learning features',
        'Certificate of completion'
      ]
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  const handlePayment = () => {
    // Implement payment logic here
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Select the perfect plan for your learning journey
        </Typography>

        <Grid container spacing={4} className={styles.plansContainer}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.title}>
              <Card 
                className={`${styles.planCard} ${plan.title === 'Premium' ? styles.highlighted : ''}`}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
              >
                <CardContent>
                  <Typography variant="h4" className={styles.planTitle}>
                    {plan.title}
                  </Typography>
                  <Typography variant="h3" className={styles.planPrice}>
                    {plan.price}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {plan.duration}
                  </Typography>
                  <Box className={styles.features}>
                    {plan.features.map((feature, index) => (
                      <Typography 
                        key={index} 
                        variant="body1"
                        className={styles.feature}
                      >
                        <CheckCircle fontSize="small" className={styles.checkIcon} />
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    Select Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Payment Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogContent>
            <TextField
              label="Card Number"
              fullWidth
              margin="normal"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Expiry Date"
                  fullWidth
                  margin="normal"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                />
              </Grid>
            </Grid>
            <TextField
              label="Card Holder Name"
              fullWidth
              margin="normal"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handlePayment} variant="contained" color="primary">
              Pay {selectedPlan?.price}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
            Payment successful! Your plan is now active.
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default Payment;