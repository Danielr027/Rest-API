const bcrypt = require("bcrypt");

(async () => {
    const plainPassword = "Daniel1234";  // La contraseña en texto plano
    const hashedPassword = "$2b$10$0tNYoRVGukrS.ICQlGdCFuD1ebpIw1tgxnvBbE6iuJifGq8DFIib.";  // La contraseña hasheada

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("¿Coinciden las contraseñas?", isMatch);
})();
