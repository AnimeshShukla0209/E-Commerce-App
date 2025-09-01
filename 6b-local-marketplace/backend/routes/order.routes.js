const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

// POST multiple orders
router.post('/', async (req, res) => {
  try {
    const orders = req.body;

    for (let order of orders) {
      if (!order.paymentMethod || !['online', 'cod'].includes(order.paymentMethod)) {
        return res.status(400).json({ error: 'paymentMethod required and must be online or cod' });
      }
      if (order.paymentMethod === 'online' && order.paymentStatus !== 'paid') {
        return res.status(400).json({ error: 'Online payments must have paymentStatus = paid' });
      }
      if (order.paymentMethod === 'cod' && order.paymentStatus !== 'cod') {
        return res.status(400).json({ error: 'COD orders must have paymentStatus = cod' });
      }
    }

    const savedOrders = await Order.insertMany(orders);
    res.status(201).json(savedOrders);
  } catch (error) {
    console.error('Failed to place orders:', error);
    res.status(500).json({ error: 'Failed to place orders' });
  }
});

// GET orders by buyer email
router.get('/buyer/:email', async (req, res) => {
  try {
    const orders = await Order.find({ buyerEmail: req.params.email }).populate('productId');
    res.json(orders);
  } catch (err) {
    console.error('Failed to get orders:', err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// CANCEL order
router.put('/cancel/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Check if order is already cancelled or refunded
    if (order.status === 'cancelled' || order.status === 'refunded') {
      return res.status(400).json({ error: 'Order already cancelled or refunded' });
    }

    // Set delivery status to cancelled for all cases
    order.deliveryStatus = 'cancelled';

    // Handle different payment scenarios
    if (order.paymentStatus === 'paid') {
      // For paid orders (online payments)
      order.paymentStatus = 'refund_pending';
      order.status = 'cancelled';
      await order.save();
      return res.json({ 
        message: 'Order cancelled. Refund pending approval from vendor.',
        order 
      });
    } 
    else if (order.paymentMethod === 'cod') {
      // For COD orders
      order.paymentStatus = 'cancelled';
      order.status = 'cancelled';
      await order.save();
      return res.json({ 
        message: 'COD order cancelled successfully.',
        order 
      });
    }
    else {
      // For any other cases (shouldn't normally happen)
      order.paymentStatus = 'cancelled';
      order.status = 'cancelled';
      await order.save();
      return res.json({ 
        message: 'Order cancelled successfully.',
        order 
      });
    }

  } catch (err) {
    console.error('Failed to cancel order:', err);
    res.status(500).json({ 
      error: 'Failed to cancel order',
      details: err.message 
    });
  }
});

module.exports = router;