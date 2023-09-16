const DataTypes = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
/* ------------------------------------------------------------- */ 
module.exports = (sequelize) => {
  // defino el modelo
/* ------------------------------------------------------------- */ 
  sequelize.define('sale', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    stock:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalPrice:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    purchase_date:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    bill:{
      type: DataTypes.UUID,
      allowNull: false,
    },  

  },

  {timestamps: false},
  
  );
};
/* ------------------------------------------------------------- */ 