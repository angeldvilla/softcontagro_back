const Category = require("../models/category");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary");

// Crear nueva categoria   =>   /api/v1/admin/category/new
exports.newCategory = catchAsyncErrors(async (req, res, next) => {
  let images = req.body.images || [];

  let imagesLinks = [];

  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "category",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  req.body.images = imagesLinks;

  const category = await Category.create(req.body);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Categoria no encontrada",
    })
  }
  res.status(201).json({
    success: true,
    category,
  });
});

// Obtener todas las categorias   =>   /api/v1/genres
exports.getCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.find();

  res.status(200).json({
    success: true,
    category,
  });
});

// Eliminar Una Categoria   =>   /api/v1/admin/category/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.genreID);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Categoria no encontrada",
    })
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "Categoria eliminada.",
  });
});
