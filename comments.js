// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Comment = require('../../models/Comment');
const auth = require('../../middleware/auth');

// @route   POST api/comments
// @desc    Create comment
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('content', 'Content is required')
        .not()
        .isEmpty(),
      check('post', 'Post is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 error with errors array
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create new comment
      const newComment = new Comment({
        content: req.body.content,
        post: req.body.post,
        user: req.user.id
      });

      // Save comment
      const comment = await newComment.save();

      // Return comment
      res.json(comment);
    } catch (err) {
      console.error(err.message);
      // Return 500 error
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/comments
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get comments
    const comments = await Comment.find().sort({ date: -1 });

    // Return comments
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    // Return 500 error
    res.status(500).send('Server Error');
  }
});

// @route   GET api/comments/:id
// @desc    Get comment by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Get comment
    const comment = await Comment.findById(req.params.id);

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Return comment
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    // Check if comment ID is valid
    if