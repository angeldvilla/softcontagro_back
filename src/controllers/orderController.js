const Order = require("../models/order");
const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Crear nuevo pedido  =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt,
    deliveredAt,
    user
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt,
    deliveredAt,
    user
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// Obtener un pedido   =>   /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "No se encontró un pedido con este ID",
    })
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Iniciar sesión en pedidos de usuarios   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ user: userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'No se encontraron pedidos' });
  }
});

// Obtener todos los pedidos - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  try {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch {
    res.status(500).json({ success: false, error: 'No se encontraron pedidos' });
  }
});

// Actualizar / Procesar pedido - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "succeeded") {
    return res.status(400).json({
      success: false,
      message: "Ya se ha entregado este pedido",
    })
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

// Eliminar pedido   =>   /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "No se encontró un pedido con este ID",
    })
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
