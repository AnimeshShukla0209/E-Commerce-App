const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Product = require('../models/product.model');

// GET /api/vendor-orders?email=vendor@example.com
router.get('/', async (req, res) => {
  try {
    const vendorEmail = req.query.email;
    if (!vendorEmail) {
      return res.status(400).json({ message: 'Vendor email is required' });
    }

    // Find products for vendor
    const products = await Product.find({ email: vendorEmail }).select('_id');
    if (!products.length) {
      return res.json([]); // No products → no orders
    }
    const productIds = products.map(p => p._id);

    // Find orders for these products, populate product details
    const orders = await Order.find({ productId: { $in: productIds } })
      .populate('productId')
      .exec();

    res.json(orders);
  } catch (err) {
    console.error('Error fetching vendor orders:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this new route to vendor-orders.routes.js
router.put('/update-delivery/:orderId', async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status transition
    if (order.status === 'cancelled' || order.status === 'refunded' || order.status === 'refund_pending') {
      if (deliveryStatus !== 'pending' && deliveryStatus !== 'cancelled') {
        return res.status(400).json({ message: 'Cancelled orders can only be pending or cancelled' });
      }
    }

    order.deliveryStatus = deliveryStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('Error updating delivery status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
