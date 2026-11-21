const Order = require('../models/Order');
const fs = require('fs');
const path = require('path');

const generateInvoiceNumber = () => {
  return 'SA-' + Math.floor(100000 + Math.random() * 900000);
};

const createOrder = async (req, res) => {
  try {
    const { serviceId, serviceTitle, requirements, pricing } = req.body;
    
    if (!serviceTitle) {
      return res.status(400).json({ message: 'Service title is required.' });
    }

    // Handle uploaded files
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push(`/uploads/${file.filename}`);
      });
    }

    const newOrder = await Order.create({
      customer: req.user.id,
      service: serviceId || null,
      serviceTitle,
      requirements: requirements || '',
      attachments,
      pricing: pricing ? Number(pricing) : 0,
      invoiceNumber: generateInvoiceNumber(),
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({ message: 'Order submitted successfully!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order.', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin' || req.user.role === 'designer') {
      orders = await Order.find();
    } else {
      orders = await Order.find({ customer: req.user.id });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Role verification
    if (req.user.role === 'customer' && order.customer !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this order.' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order.', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryDate } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (deliveryDate) updateData.deliveryDate = deliveryDate;

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Trigger local socket notification if socket.io is set up (handled in server index.js)
    if (global.io) {
      global.io.to(updated.customer).emit('order_status_updated', {
        orderId: updated._id || updated.id,
        status: updated.status,
        serviceTitle: updated.serviceTitle
      });
    }

    res.status(200).json({ message: 'Order status updated successfully!', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status.', error: error.message });
  }
};

const assignDesigner = async (req, res) => {
  try {
    const { designerId } = req.body;
    
    const updated = await Order.findByIdAndUpdate(req.params.id, { designer: designerId }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ message: 'Designer assigned successfully!', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign designer.', error: error.message });
  }
};

const uploadFinalFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No deliverable files uploaded.' });
    }

    const finalFiles = req.files.map(file => `/uploads/${file.filename}`);
    
    const updated = await Order.findByIdAndUpdate(req.params.id, {
      finalFiles,
      status: 'completed'
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Socket alert
    if (global.io) {
      global.io.to(updated.customer).emit('order_completed', {
        orderId: updated._id || updated.id,
        serviceTitle: updated.serviceTitle,
        files: finalFiles
      });
    }

    res.status(200).json({ message: 'Final deliverables uploaded. Order completed!', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload deliverables.', error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ message: 'Payment status is required.' });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ message: 'Payment status updated!', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment status.', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  assignDesigner,
  uploadFinalFiles,
  updatePaymentStatus
};
