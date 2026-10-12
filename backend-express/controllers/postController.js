const express = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../prisma/client');
const fs = require('fs');
const path = require('path');

// 1. Get All Posts / Thrift Items
const findPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { id: 'desc' },
    });

    res.status(200).send({
      success: true,
      message: 'Get all items successfully',
      data: posts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// 2. Create Post / Thrift Item
const createPost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If validation fails and file was uploaded, remove uploaded file
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  if (!req.file) {
    return res.status(422).json({
      success: false,
      message: 'Image is required',
      errors: [{ path: 'image', msg: 'Image is required' }],
    });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        image: req.file.filename,
      },
    });

    res.status(201).send({
      success: true,
      message: 'Item created successfully',
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// 3. Get Post / Thrift Item By ID
const findPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).send({
        success: false,
        message: `Item with ID ${id} not found`,
      });
    }

    res.status(200).send({
      success: true,
      message: `Get item with ID ${id} successfully`,
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// 4. Update Post / Thrift Item
const updatePost = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(404).send({
        success: false,
        message: `Item with ID ${id} not found`,
      });
    }

    let updateData = {
      title: req.body.title,
      content: req.body.content,
      updatedAt: new Date(),
    };

    if (req.file) {
      // Delete previous image file
      const oldFilePath = path.join(__dirname, '../uploads', existingPost.image);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (e) {
          console.warn('Could not remove old file:', e.message);
        }
      }
      updateData.image = req.file.filename;
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).send({
      success: true,
      message: 'Item updated successfully',
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// 5. Delete Post / Thrift Item
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return res.status(404).send({
        success: false,
        message: `Item with ID ${id} not found`,
      });
    }

    // Delete image file
    const filePath = path.join(__dirname, '../uploads', existingPost.image);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('Could not remove file:', e.message);
      }
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.status(200).send({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  findPosts,
  createPost,
  findPostById,
  updatePost,
  deletePost,
};
