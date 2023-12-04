const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./usersModel");

const UserAvatar = sequelize.define(
  "userAvatar",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

UserAvatar.belongsTo(User, { foreignKey: "userId", targetKey: "id" });
User.hasOne(UserAvatar, { foreignKey: "userId", sourceKey: "id" });

module.exports = UserAvatar;
