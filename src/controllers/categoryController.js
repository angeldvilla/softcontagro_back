const db = require("../db.js");

const getAllCategorys = async () => {
  try {
    const [category] = await db.execute(
      `
      SELECT * FROM categorias
        `
    );

    return { code: 200, data: category };
  } catch (error) {
    console.error("Error en la consulta de categorias:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

const updateCategory = async (categoryId, categoryName) => {
  try {
    const [category] = await db.execute(
      `
        UPDATE categorias
        SET nombre = ?
        WHERE id = ?
        `,
      [categoryName, categoryId]
    );

    if (category.affectedRows === 0) {
      return { code: 404, message: "Categoría no encontrada" };
    }

    return {
      code: 200,
      message: "Categoría editada exitosamente",
      data: category,
    };
  } catch (error) {
    console.error("Error en la edición de categoría:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

module.exports = { getAllCategorys, updateCategory };
