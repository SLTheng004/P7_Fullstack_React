const express = require('express')
const router = express.Router()
const { Posts, Likes } = require('../models')
const { validateToken } = require('../middleware/Auth');
const { multer } = require('../middleware/multer');

//get list of post and list of likes - for home page
router.get('/', validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({ include: [Likes] })
    const likedPosts = await Likes.findAll({where: {UserId: req.user.id}})
    res.status(200).json({listOfPosts: listOfPosts, likedPosts: likedPosts});
});

//get post by id when clicking specific post
router.get('/byId/:id', async (req, res) => {
    const id = req.params.id
    const post = await Posts.findByPk(id).then(() => {
      res.status(200).json(post);
    }).catch((error) => {
      res.status(400).json(error);
    });
});

//request to make a post
router.post('/', validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username; 
    await Posts.create(post).then(() => {
      res.status(201).json({message:"Post has been added!"});
    }).catch((error) => {
      res.status(400).json(error);
    });
});

//request to delete post
router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await Posts.destroy({
      where: {
        id: postId,
      }
    }).then(() =>
    res.status(200).json({ message: "Post has been deleted!" })
    ).catch((error) => {
      res.status(400).json({ error });
    });
  });


// router.post('/', validateToken, multer, async (req, res) => {
//     const post = ({
//         imageUrl: url + '/images/' + req.file.filename,
//         username: req.user.username,
//     })
//     await Posts.create(post);
//     res.json(post);
// });

module.exports = router;