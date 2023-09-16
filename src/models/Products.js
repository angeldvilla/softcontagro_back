const DataTypes = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
/* ------------------------------------------------------------- */ 
module.exports = (sequelize) => {
  // defino el modelo
/* ------------------------------------------------------------- */ 
  sequelize.define('product', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    describe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },

  {timestamps: false},
  
  );
};
/* ------------------------------------------------------------- */ 