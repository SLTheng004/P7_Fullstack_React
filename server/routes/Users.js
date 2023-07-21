const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middleware/Auth')

//registration
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 1000).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

//login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });

    if (!user) { res.json({ error: 'User does not exist' })}
    else {
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {res.json({ error: 'Wrong username and password combination' })}
        else {
          const accessToken = sign(
            { username: user.username, id: user.id }, 
            'supersecret' 
            ); 
          res.json({token: accessToken, username: username, id: user.id}); 
        }
      });
    };
});

//checks to see if auth
router.get('/user', validateToken, (req, res) => {
  res.json(req.user);
})

router.delete('/user/:id', validateToken, async (req, res) => {
  const userId = req.params.id;

  await Users.destroy({
      where: {
          id: userId,
      },
  }).then(() => {
      res.status(200).json({message: 'Account Deleted'}) 
  }).catch((error) => res.status(400).json({ error }));
});


module.exports = router;