module.exports = (sequelize, DataTypes) => {

    const Posts = sequelize.define("Posts", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: "cascade", //deletes all comments when post is deleted
        });
        Posts.hasMany(models.Likes, {
            onDelete: "cascade", //deletes all likes when post is deleted
        });
        Posts.hasOne(models.NewPostNotif);
        models.NewPostNotif.belongsTo(Posts, {
            foreignKey: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
              }
        });
    }

    return Posts;
};