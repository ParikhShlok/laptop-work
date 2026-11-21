const Portfolio = require('../models/Portfolio');

const getPortfolios = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }
    const items = await Portfolio.find(filter);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio items.', error: error.message });
  }
};

const createPortfolio = async (req, res) => {
  try {
    const { title, description, category, imageUrl, beforeImageUrl } = req.body;

    // Support uploaded files if applicable
    let finalImageUrl = imageUrl;
    let finalBeforeImageUrl = beforeImageUrl;

    if (req.files) {
      if (req.files.image) {
        finalImageUrl = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.beforeImage) {
        finalBeforeImageUrl = `/uploads/${req.files.beforeImage[0].filename}`;
      }
    }

    if (!title || !description || !category || !finalImageUrl) {
      return res.status(400).json({ message: 'Title, description, category, and image are required.' });
    }

    const newItem = await Portfolio.create({
      title,
      description,
      category: category.toLowerCase(),
      imageUrl: finalImageUrl,
      beforeImageUrl: finalBeforeImageUrl || null
    });

    res.status(201).json({ message: 'Portfolio item added!', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create portfolio item.', error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { title, description, category, imageUrl, beforeImageUrl } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category.toLowerCase();
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (beforeImageUrl !== undefined) updateData.beforeImageUrl = beforeImageUrl;

    const updated = await Portfolio.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Portfolio item not found.' });
    }

    res.status(200).json({ message: 'Portfolio item updated!', item: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update portfolio.', error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Portfolio item not found.' });
    }
    res.status(200).json({ message: 'Portfolio item deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete portfolio.', error: error.message });
  }
};

const likePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    
    const likes = (item.likes || 0) + 1;
    const updated = await Portfolio.findByIdAndUpdate(req.params.id, { likes }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to like portfolio item.', error: error.message });
  }
};

module.exports = { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio, likePortfolioItem };
