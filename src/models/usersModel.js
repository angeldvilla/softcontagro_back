const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Role = require("./roleModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Users = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: [3, 50],
          msg: "El nombre debe tener entre 3 y 50 caracteres",
        },
        isInt: {
          msg: "Ingrese un nombre válido",
        },
      },
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: [3, 50],
          msg: "El apellido debe tener entre 3 y 50 caracteres",
        },
        isInt: {
          msg: "Ingrese un apellido válido",
        },
      },
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: {
          args: [10],
          msg: "La cedula debe tener 10 digitos",
        },
        isDecimal: {
          msg: "Ingrese una cedula válida",
        },
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: [8, 16],
          msg: "La contraseña debe tener al menos entre 8 y 16 caracteres",
        },
      },
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    reset_password_token: {
      type: DataTypes.STRING,
    },
    reset_password_expire: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

Users.belongsTo(Role, { foreignKey: "rol_id", targetKey: "id" });
Role.hasMany(Users, { foreignKey: "rol_id", sourceKey: "id" });

// Hook (similar al pre-save)
Users.beforeCreate(async (user, options) => {
  if (user.changed("contraseña")) {
    user.contraseña = await bcrypt.hash(user.contraseña, 10);
  }
});

// Método de clase para generar el token JWT
Users.prototype.generateJWTToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Método de instancia para comparar contraseñas
Users.prototype.comparePassword = async function (contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};

// Método de instancia para generar el token de restablecimiento de contraseña
Users.prototype.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.reset_password_token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.reset_password_expire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = Users;
