module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      postsRead: {
        type: DataTypes.STRING,
        defaultValue: "[]"
      }
    });
  
    Users.associate = (models) => {
      Users.hasMany(models.Likes, {
          onDelete: "cascade", //deletes all comments when post is deleted
      });
  }
    return Users;
  };