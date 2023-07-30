module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      id: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
    });
  
    Users.associate = (models) => {
      Users.hasMany(models.Likes, {
          onDelete: "cascade",
      });
  }
    return Users;
  };