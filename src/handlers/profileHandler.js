const {
  getProfileUser,
  updateProfileUser,
  deleteProfileUser,
} = require("../controllers/profileController");

const profileUser = async (req, res) => {
  try {
    const userId = req.params;
    const profile = await getProfileUser(userId);

    return res.status(200).json({
      code: 200,
      message: "Perfil obtenido exitosamente",
      data: profile,
    });
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Editar perfil del usuario
const editProfile = async (req, res) => {
  try {
    const userId = req.params;
    const {
      nombre_completo,
      cedula,
      telefono,
      correo_electronico,
      imagen_url,
    } = req.body;

    if (!nombre_completo || !cedula || !telefono || !correo_electronico) {
      return res.status(400).json({
        code: 400,
        message: "Los campos son requeridos, completelos por favor para editar",
      });
    }
    const profileUpdated = await updateProfileUser(userId, {
      nombre_completo,
      cedula,
      telefono,
      correo_electronico,
      imagen_url,
    });

    if (profileUpdated?.code === 200) {
      return res.status(profileUpdated?.code).json({
        code: profileUpdated?.code,
        message: profileUpdated?.message,
        data: profileUpdated?.data,
      });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Error al editar el perfil" });
    }
  } catch (error) {
    console.error("Error en el servidor, intente mas tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Eliminar cuenta del usuario
const deleteProfile = async (req, res) => {
  try {
    const userId = req.params;

    const deleteAccount = await deleteProfileUser(userId);

    if (deleteAccount?.code === 200) {
      return res.status(deleteAccount?.code).json({
        code: deleteAccount?.code,
        message: deleteAccount?.message,
        data: deleteAccount?.data,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error al eliminar la cuenta, intente de nuevo",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente mas tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

module.exports = { profileUser, editProfile, deleteProfile };
