const Product = require("../models/productModel");
const Image = require("../models/imageModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
const createProduct = catchAsyncErrors(async (req, res, next) => {
    const { images, ...productData } = req.body;

    const createdProduct = await Product.create(productData);

    await Promise.all(
        images.map(async (image) => {
            const result = await cloudinary.v2.uploader.upload(image, {
                folder: "products",
            });

            return Image.create({
                url: result.secure_url,
                productId: createdProduct.id,
            });
        })
    );

    res.status(201).json({
        success: true,
        message: "Producto Creado Correctamente",
        product: createdProduct,
    });
});

// Get All Product
const getAllProducts = catchAsyncErrors(async (req, res, next) => {

    // Productos a mostrar por pagina
    const resultPerPage = 8;

    // Obtener la cantidad total de productos
    const productsCount = await Product.count();

    const apiFeature = new ApiFeatures(Product.findAll(), req.query)
        .search()
        .filter();

    // Obtener los productos después de aplicar búsqueda y filtrado
    let products = await apiFeature.query;

    // Obtener la cantidad de productos después de aplicar filtrado
    let filteredProductsCount = products.length;

    // Aplicar paginación
    apiFeature.pagination(resultPerPage);

    // Obtener los productos después de aplicar paginación
    products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get All Product (Admin)
const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.findAll();

    res.status(200).json({
        success: true,
        products,
    });
});

// Get Product Details
const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Producto no encontrado", 404));
    }

    const images = await Image.findAll({
        where: {
            producto_id: req.params.id,
        },
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// Update Product -- Admin
const updateProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Producto no encontrado", 404));
    }

    // Actualizar el producto con nuevos datos (sin las imágenes)
    await product.update(req.body, {
        fields: ['nombre_producto', 'descripcion', 'stock', 'precio', 'estado', 'categoria_id'],
    });

    // Obtener las imágenes actuales asociadas al producto
    const currentImages = await Image.findAll({
        where: {
            producto_id: req.params.id,
        },
    });

    // Eliminar imágenes actuales de Cloudinary
    await Promise.all(currentImages.map(async (image) => {
        await cloudinary.v2.uploader.destroy(image.url);
    }));

    // Subir y asociar las nuevas imágenes a Cloudinary e Image
    const newImages = await Promise.all(req.body.images.map(async (image) => {
        const result = await cloudinary.v2.uploader.upload(image, {
            folder: "products",
        });

        return Image.create({
            url: result.secure_url,
            producto_id: req.params.id,
        });
    }));

    res.status(200).json({
        success: true,
        message: "Producto Actualizado Correctamente",
        product: { ...product.toJSON(), images: newImages },
    });
});


// Delete Product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Producto no encontrado", 404));
    }

    // Obtener las imágenes asociadas al producto
    const productImages = await Image.findAll({
        where: {
            producto_id: req.params.id,
        },
    });

    // Eliminar imágenes de Cloudinary
    await Promise.all(productImages.map(async (image) => {
        await cloudinary.v2.uploader.destroy(image.url);
    }));

    // Eliminar las imágenes de la base de datos
    await Image.destroy({
        where: {
            producto_id: req.params.id,
        },
    });

    // Eliminar el producto
    await product.destroy();

    res.status(200).json({
        success: true,
        message: "Producto Eliminado Correctamente",
    });
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductDetails,
    getAdminProducts,
    updateProduct,
    deleteProduct,
}