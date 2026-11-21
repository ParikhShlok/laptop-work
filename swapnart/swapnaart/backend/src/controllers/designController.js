const Design = require('../models/Design');

const getDesigns = async (req, res) => {
  try {
    // Return designs belonging to the current authenticated user (admin/designer)
    const designs = await Design.find({ owner: req.user.id });
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch designs.', error: error.message });
  }
};

const getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design draft not found.' });
    }

    if (design.owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.status(200).json(design);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve design draft.', error: error.message });
  }
};

const createDesign = async (req, res) => {
  try {
    const { title, canvasData, previewUrl } = req.body;
    
    if (!title || !canvasData) {
      return res.status(400).json({ message: 'Title and canvas data are required.' });
    }

    const design = await Design.create({
      owner: req.user.id,
      title,
      canvasData: typeof canvasData === 'string' ? canvasData : JSON.stringify(canvasData),
      previewUrl: previewUrl || ''
    });

    res.status(201).json({ message: 'Design draft saved successfully!', design });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save design draft.', error: error.message });
  }
};

const updateDesign = async (req, res) => {
  try {
    const { title, canvasData, previewUrl } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (canvasData) updateData.canvasData = typeof canvasData === 'string' ? canvasData : JSON.stringify(canvasData);
    if (previewUrl) updateData.previewUrl = previewUrl;

    const updated = await Design.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Design not found.' });
    }

    res.status(200).json({ message: 'Design draft updated successfully!', design: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update design.', error: error.message });
  }
};

const deleteDesign = async (req, res) => {
  try {
    const deleted = await Design.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Design not found.' });
    }
    res.status(200).json({ message: 'Design draft deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete design.', error: error.message });
  }
};

module.exports = { getDesigns, getDesignById, createDesign, updateDesign, deleteDesign };
