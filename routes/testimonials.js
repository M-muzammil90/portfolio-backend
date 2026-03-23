const express = require('express');
const { Testimonial } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    let query = {};
    
    if (active) query.active = active === 'true';

    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: { testimonials }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
});

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      data: { testimonial }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial',
      error: error.message
    });
  }
});

// @route   POST /api/testimonials
// @desc    Create new testimonial
// @access  Private (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, role, company, content, rating, active, order } = req.body;
    
    const testimonialData = {
      name,
      role,
      company: company || '',
      content,
      rating: parseInt(rating) || 5,
      active: active === 'true',
      order: parseInt(order) || 0
    };

    if (req.file) {
      testimonialData.image = `/uploads/${req.file.filename}`;
    }

    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: { testimonial }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Private (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, role, company, content, rating, active, order } = req.body;
    
    const updateData = {
      name,
      role,
      company: company || '',
      content,
      rating: parseInt(rating) || 5,
      active: active === 'true',
      order: parseInt(order) || 0
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: { testimonial }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
});

module.exports = router;
