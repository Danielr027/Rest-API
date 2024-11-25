const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    edad: { type: Number, min: 0 },
    ciudad: { type: String },
    intereses: { type: [String], default: [] },
    permiteRecibirOfertas: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin', 'merchant'], default: 'user' }
}, { timestamps: true, versionKey: false });

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    // Log para verificar ejecución
    console.log("Ejecutando pre-save para hashear la contraseña");
    
    // Hashear la contraseña
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Contraseña hasheada en pre-save:", this.password);
    next();
});

module.exports = mongoose.model("User", UserSchema);
