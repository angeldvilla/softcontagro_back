const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Address = require("./addressModel");
const Users = require("./usersModel");

const Order = sequelize.define(
  "ordenes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shippingInfo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    pagado_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    entregado_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creado_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Order.belongsTo(Address, {
  foreignKey: "shippingInfo",
  targetKey: "id",
});
Address.hasMany(Order, {
  foreignKey: "shippingInfo",
  sourceKey: "id",
});

Order.belongsTo(Users, {
  foreignKey: "usuario_id",
  targetKey: "id",
});
Users.hasMany(Order, {
  foreignKey: "usuario_id",
  sourceKey: "id",
});

module.exports = Order;
