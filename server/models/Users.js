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
      PostsRead_Id: {
        type: DataTypes.STRING,
        defaultValue: "[]"
      }
    });
  
    Users.associate = (models) => {
      Users.hasMany(models.Likes, {
          onDelete: "cascade",
      });
  }
    return Users;
  };