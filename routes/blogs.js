const express = require('express');
const { Blog } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, published } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (published) query.published = published === 'true';

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      data: { blogs }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
});

// @route   POST /api/blogs
// @desc    Create new blog post
// @access  Private (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, author, category, readTime, tags, published } = req.body;
    
    const blogData = {
      title,
      excerpt,
      content,
      author: author || 'Ahmad',
      category,
      readTime: readTime || '5 min read',
      tags: tags ? JSON.parse(tags) : [],
      published: published === 'true'
    };

    if (req.file) {
      blogData.image = `/uploads/${req.file.filename}`;
    }

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog post
// @access  Private (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, author, category, readTime, tags, published } = req.body;
    
    const updateData = {
      title,
      excerpt,
      content,
      author: author || 'Ahmad',
      category,
      readTime: readTime || '5 min read',
      tags: tags ? JSON.parse(tags) : [],
      published: published === 'true'
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog post
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
});

module.exports = router;
