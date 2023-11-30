const db = require("../db.js");

const getAllOrders = async () => {
  try {
    const [sales] = await db.execute(
      `
      SELECT * FROM pedidos
        `
    );
    return {
      code: 200,
      message: "Ventas obtenidas exitosamente",
      data: sales,
    };
  } catch (error) {
    console.error("Error en la consulta de ventas:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

// Obtener todos los pedidos de un usuario
const getAllOrdersByUser = async (userId) => {
  try {
    const [orders] = await db.execute(
      `SELECT * FROM pedidos WHERE usuario_id = ?`,
      [userId]
    );
    return {
      code: 200,
      message: "Pedidos obtenidos exitosamente",
      data: orders,
    };
  } catch (error) {
    console.error("Error en la consulta de pedidos:", error);
    return { code: 500, message: "Error en la consulta de pedidos" };
  }
};

const newOrder = async () => {
  try {
    const [order] = await db.execute(
      `INSERT INTO pedidos (usuario_id, total_precio) VALUES (?, 0)`,
      [userId]
    );
    return { code: 200, message: "Pedido creado exitosamente", data: order };
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    return { code: 500, message: "Error al crear el pedido" };
  }
};

const confirmOrder = async (userId, total_precio) => {
  try {
    // inserción en la tabla de pedidos, utilizando NOW() para obtener la fecha y hora actuales.
    const [orderConfirmed] = await db.execute(
      `
        INSERT INTO pedidos (usuario_id, total_precio, fecha, estado)
        VALUES (?, ?, NOW(), 1)
      `,
      [userId, total_precio]
    );

    //  si la inserción fue exitosa y realizas otras operaciones según sea necesario.
    if (orderConfirmed?.affectedRows === 1) {
      return {
        code: 200,
        message: "Pedido confirmado exitosamente",
        data: orderConfirmed,
      };
    } else {
      return { code: 500, message: "Error al confirmar el pedido" };
    }
  } catch (error) {
    console.error("Error al confirmar el pedido:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

const removeOrder = async (orderId) => {
  try {
    const [order] = await db.execute(
      `
        DELETE FROM pedidos 
        WHERE id = ?
        `,
      [orderId]
    );

    if (order.affectedRows === 0) {
      return {
        code: 404,
        message: "No se encontró el pedido especificado",
        data: order,
      };
    }
    return {
      code: 200,
      message: "Pedido eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error en la eliminación de producto:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

module.exports = {
  getAllOrders,
  getAllOrdersByUser,
  newOrder,
  confirmOrder,
  removeOrder,
};
