const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.use(cors({ origin: 'https://www.sovereigntrust.world' }));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Trust Indenture Documents' },
          unit_amount: 2499 // $24.99 in cents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://www.sovereigntrust.world?success=true',
      cancel_url: 'https://www.sovereigntrust.world'
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
