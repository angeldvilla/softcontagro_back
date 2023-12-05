require("dotenv").config();
const { PORT, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;
const connectDatabase = require("./src/config/db.js");
const server = require("./src/app.js");
const cloudinary = require("cloudinary");

// Conexion a la base de datos
connectDatabase();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Puerto donde se escucha la aplicación
const port = PORT || 3001;

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Manejo de errores no controlados
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error(`Cerrando el servidor debido a una promesa no controlada`);

  server.close(() => {
    process.exit(1);
  });
});
