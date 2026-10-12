const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const { validatePost } = require('../utils/validators/post');
const upload = require('../middlewares/upload');

// Route Posts / Thrift Items
router.get('/posts', postController.findPosts);
router.post('/posts', upload.single('image'), validatePost, postController.createPost);
router.get('/posts/:id', postController.findPostById);
router.put('/posts/:id', upload.single('image'), validatePost, postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
