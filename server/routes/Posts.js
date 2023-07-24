const express = require('express')
const router = express.Router()
const { Posts, Likes } = require('../models')
const { validateToken } = require('../middleware/Auth');
const { multerConfig } = require('../middleware/Multer');

//get list of post and list of likes - for home page
router.get('/', validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({ include: [Likes] });
    const likedPosts = await Likes.findAll({where: {UserId: req.user.id}})
    .then(() => {
      res.status(200).json({listOfPosts: listOfPosts, likedPosts: likedPosts});
    }).catch((error) => {
      res.status(400).json({error:error});    
    });
});

//get post by id when clicking specific post
router.get('/byId/:id', async (req, res) => {
    const id = req.params.id
    const post = await Posts.findByPk(id).then(() => {
      res.status(200).json(post);
    }).catch((error) => {
      res.status(400).json({error:error});
    });
});

//request to make a post
router.post('/', validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username; 
    await Posts.create(post).then(() => {
      res.status(201).json({message:"Post has been added!"});
    }).catch((error) => {
      res.status(400).json({error:error});
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
      res.status(400).json({error:error});
    });
  });


// My idea of how to add multer:
// router.post('/', validateToken, multerConfig, async (req, res) => {
//   const imageUrl = req.protocol + '://' + req.get('host');
//   const post = new post ({
//     title: req.user.title,
//     postText: req.user.postText,
//     imageUrl: imageUrl + '/images/' + req.file.filename,
//     username: req.user.username,
//   });
//   post.save().then(() => {
//     res.status(201).json({
//       message: 'Post has been added!'
//     });
//   }).catch((error) => {
//     res.status(400).json({error:error})
//   })
// });

module.exports = router;