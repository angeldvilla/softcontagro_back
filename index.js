const server = require("./src/app.js");
const db = require("./src/db.js");
const portListen = 3001;
/* ------------------------------------------------------------- */

  server.listen(portListen, () => {
    console.log(`servidor corriendo en el puerto ${portListen}`); 
  });
/* ------------------------------------------------------------- */
