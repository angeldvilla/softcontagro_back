const db = require("../db.js");

const getProductsCart = async (userId) => {
  try {
    const [products] = await db.execute(
      `SELECT * FROM carrito WHERE usuario_id = ?`,
      [userId]
    );
    return {
      code: 200,
      message: "Carrito obtenido exitosamente",
      data: products,
    };
  } catch (error) {
    console.error("Error en la consulta de carrito:", error);
    return { code: 500, message: "Error en la consulta de carrito" };
  }
};

const addProductCart = async (userId, productId) => {
  try {
    // Implementar lógica para agregar el producto al carrito en la base de datos
    // ...

    return { code: 200, message: "Producto agregado al carrito exitosamente" };
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    return { code: 500, message: "Error al agregar el producto al carrito" };
  }
};

const updateProductCart = async (userId, cartData) => {
  try {
    // Implementar lógica para actualizar el carrito del usuario en la base de datos
    // ...

    return { code: 200, message: "Carrito actualizado exitosamente" };
  } catch (error) {
    console.error("Error al editar el producto al carrito:", error);
    return { code: 500, message: "Error al editar el producto al carrito" };
  }
};

const deleteProductCart = async (userId, productId) => {
  try {
    // Implementar lógica para eliminar el producto del carrito en la base de datos
    // ...

    return {
      code: 200,
      message: "Producto eliminado del carrito exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar el producto al carrito:", error);
    return { code: 500, message: "Error al eliminar el producto al carrito" };
  }
};

module.exports = {
  getProductsCart,
  addProductCart,
  updateProductCart,
  deleteProductCart,
};
