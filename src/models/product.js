const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Por favor ingrese el nombre del producto"],
    trim: true,
    maxLength: [100, "El nombre del producto no puede exceder los 100 caracteres"],
  },
  price: {
    type: Number,
    required: [true, "Por favor ingrese el precio del producto"],
    maxLength: [100, "El nombre del producto no puede exceder los 5 caracteres"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Por favor ingrese la descripción del producto"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Por favor seleccione la categoría para este producto"],
  },

  seller: {
    type: String,
    required: [true, "Por favor ingresa al vendedor del producto"],
  },
  stock: {
    type: Number,
    required: [true, "Por favor ingrese el stock del producto"],
    maxLength: [100, "El nombre del producto no puede exceder los 5 caracteres"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
