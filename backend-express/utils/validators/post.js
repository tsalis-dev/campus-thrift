const { body } = require('express-validator');

const validatePost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
];

module.exports = { validatePost };
