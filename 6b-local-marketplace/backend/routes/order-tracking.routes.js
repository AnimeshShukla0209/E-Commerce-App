const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

// GET order tracking details with mock data generation
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('productId', 'name imageUrl price')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Generate mock tracking data if empty
    if (!order.trackingDetails.history || order.trackingDetails.history.length === 0) {
      order.trackingDetails.history = generateMockTrackingHistory(order.deliveryStatus);
      
      // Update the order with mock data (optional)
      await Order.findByIdAndUpdate(
        order._id,
        { 'trackingDetails.history': order.trackingDetails.history }
      );
    }

    // Format response to match Angular interface
    const response = {
      _id: order._id,
      productId: {
        name: order.productId.name,
        imageUrl: order.productId.imageUrl
      },
      deliveryStatus: order.deliveryStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingDetails: order.trackingDetails
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate mock tracking history
function generateMockTrackingHistory(deliveryStatus) {
  const statusFlow = {
    pending: ['processing'],
    shipped: ['processing', 'shipped'],
    out_for_delivery: ['processing', 'shipped','out_for_delivery'],
    delivered: ['processing', 'shipped', 'out_for_delivery', 'delivered'],
    cancelled: ['processing', 'cancelled']
  };

  const statuses = statusFlow[deliveryStatus] || ['processing'];
  const locations = [
    'Warehouse, Mumbai',
    'Sorting Facility, Delhi',
    'Local Distribution Center',
    'On Route to Your Area',
    'Your Neighborhood'
  ];

  return statuses.map((status, index) => ({
    status,
    location: locations[index] || 'Final Destination',
    timestamp: new Date(Date.now() - (statuses.length - index) * 3600000)
  }));
}

module.exports = router;