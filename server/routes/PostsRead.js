const express = require('express')
const router = express.Router()
const { PostsRead } = require('../models')
const { validateToken } = require('../middleware/Auth')

router.post('/', validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  await PostsRead.create({
    PostId,
    UserId
  }).then(() => {
    res.status(201).json({ read: true });
  }).catch((error) => {
    res.status(400).json(error);
  })
});

router.get('/', validateToken, async (req, res) => {
  const UserId = req.user.id;

  await PostsRead.findAll({
    where: {
      UserId
    }
  }).then((postsRead) => {
    res.status(200).json(postsRead)
  }).catch((error) => {
    res.status(400).json(error);
  });
});

module.exports = router;