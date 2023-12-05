const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemsModel");
const Product = require("../models/productModel");
const Address = require("../models/addressModel");
const Payment = require("../models/paymentModel");
const User = require("../models/usersModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        direccionInfoId,
        orderItems,
        paymentInfo,
        precio_articulos,
        precio_impuesto,
        precio_envio,
        precio_total,
    } = req.body;

    const order = await Order.create({
        direccionInfoId,
        orderItems,
        paymentInfo,
        precio_articulos,
        precio_impuesto,
        precio_envio,
        precio_total,
        pagado_at: Date.now(),
        estado_orden: "Enviado",
        entregado_at: null,
        creado_at: Date.now(),
        usuarioId: req.user.id,
    });
    // Crear los ítems de la orden y asociarlos a la orden
    const createdOrderItems = await Promise.all(orderItems.map(async (item) => {
        const product = await Product.findByPk(item.productoId);

        // Crear el ítem de la orden
        return OrderItem.create({
            nombre: product.nombre,
            precio: product.precio,
            cantidad: item.cantidad,
            imagen: product.imagen,
            ordenId: order.id,
        });
    }));

    // Asociar la dirección de envío a la orden
    await Address.update({ orderId: order.id }, { where: { id: direccionInfoId.id } });

    // Asociar la información de pago a la orden
    await Payment.update({ orderId: order.id }, { where: { id: paymentInfo.id } });

    res.status(201).json({
        success: true,
        order,
        orderItems: createdOrderItems,
    });
});

// get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findByPk(req.params.id, {
        include: [
            { model: User, attributes: ["nombre", "apellido", "cedula", "telefono", "email", "avatar_url"] },
            { model: OrderItem },
            { model: Address },
            { model: Payment },
        ],
    });

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// get logged in user  Orders
const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.findAll({
        where: { usuarioId: req.user.id },
        include: [
            { model: User, attributes: ["nombre", "apellido", "cedula", "telefono", "email", "avatar_url"] },
            { model: OrderItem },
            { model: Address },
            { model: Payment },
        ],
    });

    res.status(200).json({
        success: true,
        orders,
    });
});

// get all Orders -- Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.findAll({
        include: [
            { model: User, attributes: ["nombre", "apellido", "cedula", "telefono", "email", "avatar_url"] },
            { model: OrderItem },
            { model: Address },
            { model: Payment },
        ],
    });

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// update Order Status -- Admin
const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findByPk(req.params.id, {
        include: [
            { model: OrderItem },
        ],
    });

    if (!order) {
        return next(new ErrorHandler("Pedido no encontrado con este ID", 404));
    }

    if (order.estado_orden === "Entregado") {
        return next(new ErrorHandler("Ya has entregado este pedido", 400));
    }

    if (req.body.estado_orden === "Enviado") {
        // Actualizar el stock para los productos en la orden
        order.ordenItems.forEach(async (o) => {
            await updateStock(o.productoId, o.cantidad);
        });
    }

    order.estado_orden = req.body.estado_orden;

    if (req.body.estado_orden === "Entregado") {
        order.entregado_at = Date.now();
    }

    await order.save();
    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});

module.exports = {
    newOrder,
    getSingleOrder,
    getAllOrders,
    myOrders,
    updateOrder,
    deleteOrder,
}
