const express = require('express')
const router = express.Router()
const { Posts, Likes } = require('../models')
const { validateToken } = require('../middleware/Auth');
const { multer } = require('../middleware/multer');

router.get('/', validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({ include: [Likes] })
    const likedPosts = await Likes.findAll({where: {UserId: req.user.id}})
    res.json({listOfPosts: listOfPosts, likedPosts: likedPosts});
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id
    const post = await Posts.findByPk(id);
    res.json(post);
});

router.post('/', validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username; 
    await Posts.create(post);
    res.json(post);
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