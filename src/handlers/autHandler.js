const { postLogin } = require("../controllers/authController");

const authUser = async (username, password) => {
  if (!username || !password) {
    return {
      code: 400,
      message: "El usuario y la contraseña son obligatorios",
    };
  }

  if (!credentials) {
    return {
      code: 404,
      message: "Los datos ingresados no coinciden, intente de nuevo",
    };
  }

  const credentials = await postLogin(username, password);
  return {
    code: 200,
    message: "Inicio de sesión exitoso",
    data: credentials,
  };
};

module.exports = { authUser };
