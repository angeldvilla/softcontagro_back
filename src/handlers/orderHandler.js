const {
  getAllOrders,
  getAllOrdersByUser,
  newOrder,
  confirmOrder,
  removeOrder,
} = require("../controllers/orderController");

const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();

    if (orders?.code === 200) {
      return res.status(orders?.code).json({
        code: orders?.code,
        message: orders?.message,
        data: orders?.data,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error en la consulta de pedidos",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params;
    const orders = await getAllOrdersByUser(userId);

    if (orders?.code === 200) {
      return res.status(orders?.code).json({
        code: orders?.code,
        message: orders?.message,
        data: orders?.data,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error en la consulta de pedidos",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Crear un nuevo pedido (agregar productos al carrito)
const createOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    const addOrder = await newOrder(userId);

    if (addOrder?.code === 200) {
      return res.status(addOrder?.code).json({
        code: addOrder?.code,
        message: addOrder?.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error al crear el pedido",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Confirmar un pedido
const editOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Implementar lógica para confirmar un pedido
    const orderConfirmed = await confirmOrder(orderId);

    if (orderConfirmed?.code === 200) {
      return res.status(orderConfirmed?.code).json({
        code: orderConfirmed?.code,
        message: orderConfirmed?.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error al confirmar el pedido",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Eliminar un pedido
const deleteOrder = async (req, res) => {
  try {
    const id = req.params;
    const order = await removeOrder(id);

    if (order?.code === 200) {
      return res.status(order?.code).json({
        code: order?.code,
        message: order?.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error al eliminar el pedido, intente de nuevo",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

module.exports = {
  getOrders,
  getOrdersByUser,
  createOrder,
  editOrder,
  deleteOrder,
};
