const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerEmail: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cod', 'cancelled', 'refunded', 'refund_pending'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cod'],
    required: true,
  },
  paymentId: { 
    type: String,
    default: null
  },
  deliveryStatus: {
  type: String,
  enum: ['pending', 'shipping', 'out_for_delivery', 'delivered', 'cancelled'],
  default: 'pending',
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
  },
  trackingDetails: {
    currentLocation: { type: String, default: 'Warehouse' },
    estimatedDelivery: { type: Date },
    carrier: { type: String, default: 'Local Marketplace Delivery' },
    history: [{
      status: String,
      location: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  refundProcessed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (this.isModified('deliveryStatus')) {
    if (!this.trackingDetails.history) {
      this.trackingDetails.history = [];
    }
    this.trackingDetails.history.push({
      status: this.deliveryStatus,
      location: this.trackingDetails.currentLocation
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);