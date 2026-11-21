const Service = require('../models/Service');

const getServices = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    const services = await Service.find(filter);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve services.', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve service.', error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { title, description, minPrice, maxPrice, deliveryTime, category, features, faqs, image } = req.body;
    
    if (!title || !description || !minPrice || !maxPrice || !deliveryTime || !category) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const service = await Service.create({
      title,
      description,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      deliveryTime,
      category,
      features: features || [],
      faqs: faqs || [],
      image: image || ''
    });

    res.status(201).json({ message: 'Service created successfully!', service });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service.', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { title, description, minPrice, maxPrice, deliveryTime, category, features, faqs, image } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (minPrice !== undefined) updateData.minPrice = Number(minPrice);
    if (maxPrice !== undefined) updateData.maxPrice = Number(maxPrice);
    if (deliveryTime) updateData.deliveryTime = deliveryTime;
    if (category) updateData.category = category;
    if (features) updateData.features = features;
    if (faqs) updateData.faqs = faqs;
    if (image) updateData.image = image;

    const updated = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service updated successfully!', service: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service.', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.status(200).json({ message: 'Service deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service.', error: error.message });
  }
};

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
