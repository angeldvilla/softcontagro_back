const {
  getProductsCart,
  addProductCart,
  updateProductCart,
  deleteProductCart,
} = require("../controllers/cartController");

const getCart = async (req, res) => {
  try {
    const userId = req.params;

    const cartProducts = await getProductsCart(userId);

    if (cartProducts?.code === 200) {
      return res.status(cartProducts?.code).json({
        code: cartProducts?.code,
        message: cartProducts?.message,
        data: cartProducts?.data,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error en la consulta de carrito",
      });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

const addToCart = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

const updateCart = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

const removeFromCart = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart };
