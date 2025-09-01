const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Product = require('../models/product.model');

// GET pending refunds for vendor
router.get('/pending', async (req, res) => {
  try {
    const vendorEmail = req.query.email;
    if (!vendorEmail) {
      return res.status(400).json({ error: 'Vendor email is required' });
    }

    const products = await Product.find({ email: vendorEmail });
    const productIds = products.map(p => p._id);

    const orders = await Order.find({
      productId: { $in: productIds },
      paymentStatus: 'refund_pending'
    }).populate('productId', 'name price imageUrl');

    res.json(orders);
  } catch (err) {
    console.error('Refund order fetch error:', err);
    res.status(500).json({ error: 'Failed to load refund orders' });
  }
});

// PROCESS refund
router.put('/:orderId/process', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        paymentStatus: 'refunded',
        status: 'refunded',
        refundProcessed: true,
        refundDate: new Date()
      },
      { new: true }
    ).populate('productId', 'name price');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      orderId: updatedOrder._id,
      message: 'Refund processed successfully'
    });
  } catch (err) {
    console.error('Refund processing error:', err);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

module.exports = router;