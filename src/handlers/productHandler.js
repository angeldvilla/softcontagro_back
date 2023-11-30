const {
  getAllProducts,
  newProduct,
  updateProduct,
  removeProduct,
} = require("../controllers/productController");

// Obtener Productos
const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();

    if (products.code === 200) {
      return res.status(products?.code).json({
        code: products?.code,
        message: products?.message,
        data: products?.data,
      });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Error en la consulta" });
    }
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Crear Producto
const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categoria_id } = req.body;

    const Addproduct = await newProduct(
      nombre,
      descripcion,
      precio,
      imagen_url,
      categoria_id
    );
    if (Addproduct?.code === 201) {
      return res.status(products?.code).json({
        code: products?.code,
        message: products?.message,
        data: products?.data,
      });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Error al crear el producto" });
    }
  } catch (error) {
    console.error("Error en la creación de producto:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

// Editar Producto
const editProduct = async (req, res) => {
  try {
    const id = req.params;
    const { nombre, descripcion, precio, imagen_url, categoria_id } = req.body;

    const productUpdated = await updateProduct(
      id,
      nombre,
      descripcion,
      precio,
      imagen_url,
      categoria_id
    );

    if (productUpdated?.code === 200) {
      return res.status(productUpdated?.code).json({
        code: productUpdated?.code,
        message: productUpdated?.message,
        data: productUpdated?.data,
      });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Error al editar el producto" });
    }
  } catch (error) {
    console.error("Error en la edición de producto:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};
// Eliminar Producto
const deleteProduct = async (req, res) => {
  try {
    const id = req.params;

    const productRemoved = await deleteProduct(id);

    if (productRemoved?.code === 200) {
      return res.status(productRemoved?.code).json({
        code: productRemoved?.code,
        message: productRemoved?.message,
        data: productUpdated?.data,
      });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Error al eliminar el producto" });
    }
  } catch (error) {
    console.error("Error en la eliminación de producto:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

module.exports = { getProducts, createProduct, editProduct, deleteProduct };
