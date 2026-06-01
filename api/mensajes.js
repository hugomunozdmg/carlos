import express from "express";
import { ObjectId } from "mongodb";

const api = express.Router();

// POST /mensajes - enviar mensaje
api.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const db = req.app.locals.db;

    if (!senderId || !receiverId || !text)
      return res.status(400).json({ message: "Faltan datos obligatorios" });

    if (senderId === receiverId)
      return res.status(400).json({ message: "No puedes enviarte mensajes a ti mismo" });

    // Verificar que el receptor existe
    const receptor = await db.collection("usuarios").findOne({ _id: new ObjectId(receiverId) });
    if (!receptor)
      return res.status(404).json({ message: "Usuario receptor no encontrado" });

    const result = await db.collection("mensajes").insertOne({
      senderId: new ObjectId(senderId),
      receiverId: new ObjectId(receiverId),
      text,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Mensaje enviado", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// GET /mensajes/:userId - obtener conversaciones de un usuario
api.get("/:userId", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = new ObjectId(req.params.userId);

    const mensajes = await db.collection("mensajes").find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .sort({ createdAt: -1 })
    .toArray();

    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// GET /mensajes/conversacion/:userId1/:userId2 - conversacion entre dos usuarios
api.get("/conversacion/:userId1/:userId2", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId1 = new ObjectId(req.params.userId1);
    const userId2 = new ObjectId(req.params.userId2);

    const mensajes = await db.collection("mensajes").find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    })
    .sort({ createdAt: 1 }) // cronológico para conversación
    .toArray();

    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

export default api;