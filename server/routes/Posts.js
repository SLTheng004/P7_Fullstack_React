const express = require('express')
const router = express.Router()
const { Posts, Likes, NewPostNotif } = require('../models')
const { validateToken } = require('../middleware/Auth');
const { multer } = require('../middleware/Multer');

//get list of post and list of likes - for home page
router.get('/', validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: Likes, NewPostNotif });
  // const newPostNotif = await NewPostNotif.findAll({ where: {UserId: req.user.id}});
  const likedPosts = await Likes.findAll({where: {UserId: req.user.id}});
  res.json({listOfPosts: listOfPosts, likedPosts: likedPosts}); //newPostNotif: newPostNotif 
});

//get post by id when clicking specific post
router.get('/byId/:id', async (req, res) => {
  const id = req.params.id
  const post = await Posts.findByPk(id);
  res.json(post);
});

//request to make a post
router.post('/', validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username; 
  await Posts.create(post);
  res.json(post);
});

//request to delete post
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    }
  }).then(() => {
    res.status(200).json({message: 'post has been deleted'}) 
  }).catch((error) => {
     res.status(400).json({ error: error })
    });
});


// My idea of how to add multer:
  // router.post('/', validateToken, multer, async (req, res) => {
  //   const url = req.protocol + '://' + req.get('host');
  //   req.user = JSON.parse(req.user);
  //   const post = new Posts ({
  //     title: req.user.title,
  //     postText: req.user.postText, 
  //     imageUrl: url + '/images/' + req.file.filename,
  //     username: req.user.username
  //   });
  //   console.log(post);
  //   await post.save().then((post) => {
  //     res.status(201).json(post);
  //   }).catch((error) => {
  //     res.status(400).json({
  //       error: error
  //     });
  //   });
  // });

module.exports = router;