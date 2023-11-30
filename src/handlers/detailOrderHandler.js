const { orderDetailController } = require("../controllers/detailOrderController");

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params;
    const orderDetails = await orderDetailController(orderId);

    if (orderDetails?.code === 200) {
      return res.status(orderDetails?.code).json({
        code: orderDetails?.code,
        message: orderDetails?.message,
        data: orderDetails?.data,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error en la consulta de detalles de pedido",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

module.exports = { getOrderDetails };
