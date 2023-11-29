const { getAuthentication } = require("../controllers/authController");
const { generateToken } = require("../utils/authUtils");

const authUser = async (username, password) => {
  try {
    if (!username || !password) {
      return {
        code: 400,
        message: "El usuario y la contraseña son obligatorios",
      };
    }

    const credentials = await getAuthentication(username, password);

    if (!credentials) {
      return {
        code: 404,
        message: "Los datos ingresados no coinciden, intente de nuevo",
      };
    }

    // Generar token JWT
    const token = generateToken(credentials.ID, credentials.Usuario, [
      credentials.Rol,
    ]);

    return {
      code: 200,
      message: "Inicio de sesión exitoso",
      token: token,
    };
  } catch (error) {
    console.error("Error en la autenticación:", error);
  }
};

module.exports = { authUser };
