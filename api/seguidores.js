import express from "express";
import { ObjectId } from "mongodb";

const api = express.Router();

// POST /seguidores/seguir - seguir usuario
api.post("/seguir", async (req, res) => {
  try {
    const { userId, followId } = req.body;
    const db = req.app.locals.db;

    if (!userId || !followId)
      return res.status(400).json({ message: "Faltan datos obligatorios" });

    if (userId === followId)
      return res.status(400).json({ message: "No puedes seguirte a ti mismo" });

    // Verifica que el usuario a seguir existe
    const usuarioAseguir = await db.collection("usuarios").findOne({ _id: new ObjectId(followId) });
    if (!usuarioAseguir)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Agregar followId a la lista de following del userId
    await db.collection("seguidores").updateOne(
      { userId: new ObjectId(userId) },
      { $addToSet: { following: new ObjectId(followId) } },
      { upsert: true }
    );

    res.json({ message: "Siguiendo usuario" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// POST /seguidores/dejar - dejar de seguir
api.post("/dejar", async (req, res) => {
  try {
    const { userId, followId } = req.body;
    const db = req.app.locals.db;

    if (!userId || !followId)
      return res.status(400).json({ message: "Error" });

    await db.collection("seguidores").updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { following: new ObjectId(followId) } }
    );

    res.json({ message: "Dejaste de seguir al usuario" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// GET /seguidores/:userId - obtener lista de seguidores
api.get("/:userId", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.params.userId;

    const resultado = await db.collection("seguidores").findOne({ userId: new ObjectId(userId) });

    res.json({ following: resultado?.following || [] });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

export default api;