import express from "express";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const api = express.Router();

// POST /usuarios/registro
api.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = req.app.locals.db;

    ////////Check de datos
    if (!username || !email || !password)
      return res.status(400).send({ message: "Faltan datos obligatorios" });

    const existemail = await db.collection("usuarios").findOne({ email });
    if (existemail)
      return res.status(400).json({ message: "El correo ya está registrado" });

    const existeuser = await db.collection("usuarios").findOne({ username });
    if (existeuser)
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está registrado" });

    if (password.length < 8) {
      return res.status(400).json({message: "La contraseña debe tener al menos 8 caracteres"});
    }

    /////////////////////////////////////////////

    const hash = await bcrypt.hash(password, 8);
    const result = await db
      .collection("usuarios")
      .insertOne({ username, email, password: hash, createdAt: new Date() });

    res.status(201).json({ message: "Usuario creado", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// POST /usuarios/login
api.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;

    const usuario = await db.collection("usuarios").findOne({ email });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    res.json({
      message: "Login exitoso",
      usuario: { id: usuario._id, username: usuario.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

//getprueba
api.get("/seeusers", async (req, res) => {
  try {
    const getusers = await req.app.locals.db
      .collection("usuarios")
      .find()
      .toArray();
    res.json(getusers);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// PUT /usuarios/edituser/:userid
api.put("/edituser/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const { username, email, password } = req.body;
    const db = req.app.locals.db;

    // Verificar que el usuario existe
    const usuario = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(userid) });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const campos = {};
    if (username) campos.username = username;
    if (email) campos.email = email;
    if (password) campos.password = await bcrypt.hash(password, 8); // cambia password

    await db
      .collection("usuarios")
      .updateOne({ _id: new ObjectId(userid) }, { $set: campos });
    res.json({ message: "Datos actualizados correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// DELETE /usuarios/deleteuser/:userid
api.delete("/deleteuser/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const db = req.app.locals.db;

    const usuario = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(userid) });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    await db.collection("usuarios").deleteOne({ _id: new ObjectId(userid) });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

export default api;
