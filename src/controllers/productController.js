const db = require("../db.js");

const getAllProducts = async () => {
  try {
    const [product] = await db.execute(
      `
      SELECT * FROM productos
        `
    );

    return {
      code: 200,
      message: "Productos obtenidos exitosamente",
      data: product,
    };
  } catch (error) {
    console.error("Error en la consulta de productos:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

const newProduct = async (
  productName,
  productDescription,
  productPrice,
  productImageUrl,
  categoryId
) => {
  try {
    const [product] = await db.execute(
      `
        INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        productName,
        productDescription,
        productPrice,
        productImageUrl,
        categoryId,
      ]
    );

    return {
      code: 201,
      message: "Producto creado exitosamente",
      data: product,
    };
  } catch (error) {
    console.error("Error en la creación de producto:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

const updateProduct = async (
  productId,
  productName,
  productDescription,
  productPrice,
  productImageUrl,
  categoryId
) => {
  try {
    const [product] = await db.execute(
      `
        UPDATE productos
        SET nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, categoria_id = ?
        WHERE id = ?
      `,
      [
        productName,
        productDescription,
        productPrice,
        productImageUrl,
        categoryId,
        productId,
      ]
    );

    if (product.affectedRows === 0) {
      return { code: 404, message: "No se encontró el producto especificado" };
    }

    return {
      code: 200,
      message: "Producto editado exitosamente",
      data: product,
    };
  } catch (error) {
    console.error("Error en la edición de producto:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

const removeProduct = async (productId) => {
  try {
    const [product] = await db.execute(
      `
        DELETE FROM productos
        WHERE id = ?
      `,
      [productId]
    );

    if (product.affectedRows === 0) {
      return { code: 404, message: "No se encontró el producto especificado" };
    }

    return {
      code: 200,
      message: "Producto eliminado exitosamente",
      data: product,
    };
  } catch (error) {
    console.error("Error en la eliminación de producto:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

module.exports = { getAllProducts, newProduct, updateProduct, removeProduct };
