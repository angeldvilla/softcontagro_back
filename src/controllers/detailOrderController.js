const db = require("../db.js");

const getAllOrderDetails = async (orderId) => {
  try {
    const [orderDetails] = await db.execute(
      `
      SELECT dp.id, dp.cantidad, dp.precio_unitario, p.nombre AS producto_nombre, p.descripcion AS producto_descripcion, p.imagen AS producto_imagen
      FROM detalles_pedido dp
      JOIN productos p ON dp.producto_id = p.id
      WHERE dp.pedido_id = ?
      `,
      [orderId]
    );

    return {
      code: 200,
      message: "Detalles de pedido obtenidos exitosamente",
      data: orderDetails,
    };
  } catch (error) {
    console.error("Error en la consulta de detalles de pedido:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

module.exports = { getAllOrderDetails };
