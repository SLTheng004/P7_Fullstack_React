module.exports = (sequelize, DataTypes) => {

    const Posts = sequelize.define("Posts", {
        id: {
            type: sequelize.Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
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
            onDelete: "cascade", 
        });
        Posts.hasMany(models.Likes, {
            onDelete: "cascade", 
        });
        Posts.hasMany(models.Users, {
            foreignKey: {
                name: 'PostsRead_Id'
            }
        })

    }

    return Posts;
};