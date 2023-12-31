const express = require('express');
const router = express.Router();
const { Posts, Likes, PostsRead } = require('../models');
const { validateToken } = require('../middleware/Auth');
const multer = require('../middleware/Multer');
const fs = require('fs');

//get list of post and list of likes - for home page
router.get('/', validateToken, multer, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

//get list of read posts from list of posts
router.get('/', validateToken, async (req, res) => {
  const posts = await Posts.findAll({ include: [PostsRead] });
  const listOfReadPosts = await PostsRead.findAll({ where: { UserId: req.user.id } });
  res.status(200).json({ posts: posts, listOfReadPosts: listOfReadPosts });
});

//get post by id when clicking specific post
router.get('/byId/:id', multer, async (req, res) => {
  const id = req.params.id
  const post = await Posts.findByPk(id);
  res.json(post);
  if (!id) {
    res.status(400).json({ error: error })
  } else {
    res.status(200);
  }
});

//create post controller
router.post('/', validateToken, multer, async (req, res) => {
  const body = req.body;
  const url = req.protocol + '://' + req.get('host');
  const post = new Posts({
    title: body.title,
    postText: body.postText,
    imageUrl: req.file ? url + '/images/' + req.file.filename : "",
  });
  post.username = req.user.username;
  post.save()
    .then(() => {
      res.json({ message: "post has been created" });
    }).catch((error) =>
      console.log(error))
});

//delete post controller
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  Posts.findOne({ id: req.params.id })
    .then((post) => {
      const filename = post.imageUrl.split("/images")[1];
      fs.unlink(`images/${filename}`, () => {
        Posts.destroy({
          where: {
            id: postId,
          }
        })
      })
    }).then(() => {
      res.status(200).json({ message: 'post has been deleted' })
    }).catch((error) => {
      res.status(400).json({ error: error });
    });
});

module.exports = router;