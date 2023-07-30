const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(cors());

const db = require('./models');
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routers 
const postRouter = require('./routes/Posts');
app.use('/posts', postRouter);

const commentsRouter = require('./routes/Comments');
app.use('/comments', commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);



db.sequelize.sync().then(() => {
    app.listen(4000, () => {
        console.log('Server running on port 4000...');
    });
});
