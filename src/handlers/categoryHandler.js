const {
  getAllCategorys,
  updateCategory,
} = require("../controllers/categoryController");

// Obtener Categorias
const getCategorys = async (req, res) => {
  try {
    const categories = await getAllCategorys();

    if (categories?.code === 200) {
      return res.status(200).json({
        code: 200,
        message: "Categorias obtenidas exitosamente",
        data: categories,
      });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Error en la consulta" });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Editar categorias
const editCategory = async (req, res) => {
  try {
    const { id, nombre } = req.body;

    const categoryUpdated = await updateCategory(id, nombre);

    if (categoryUpdated?.code === 200) {
      return res.status(categoryUpdated?.code).json({
        code: categoryUpdated?.code,
        message: categoryUpdated?.message,
        data: categoryUpdated?.data,
      });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Error al editar la categoria" });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

module.exports = { getCategorys, editCategory };
