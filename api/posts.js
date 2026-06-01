import express from "express";
import { ObjectId } from "mongodb";

const api = express.Router();

// POST /posts/addpost - crear post
api.post("/addpost", async (req, res) => {
  try {
    const { userId, username, body } = req.body;
    const db = req.app.locals.db;

    if (!body)
      return res.status(400).json({ message: "Faltan datos obligatorios" });

    if (!userId || !username)
      return res.status(400).json({ message: "Tienes un error mayor, por favor recarga la pagina o inicia sesión de nuevo" });

    const result = await db.collection("posts").insertOne({
      userId: new ObjectId(userId),
      username,
      body,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Post creado", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// GET /posts/user/:userId - posts de un usuario
api.get("/user/:userId", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.params.userId;

    const posts = await db
      .collection("posts")
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// GET /posts/feed - posts de una lista de usuarios
api.post("/feed", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { userIds } = req.body;

    const objectIds = userIds.map((id) => new ObjectId(id));

    const posts = await db
      .collection("posts")
      .find({ userId: { $in: objectIds } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// PUT /posts/editpost/:postId - editar post
api.put("/editpost/:postId", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const postId = req.params.postId;
    const { body } = req.body;

    if (!body)
      return res.status(400).json({ message: "Faltan datos obligatorios" });

    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
    if (!post)
      return res.status(404).json({ message: "Post no encontrado" });

    await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      { $set: { body, updatedAt: new Date() } }
    );

    res.json({ message: "Post actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// DELETE /posts/deletepost/:postId - eliminar post
api.delete("/deletepost/:postId", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const postId = req.params.postId;

    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
    if (!post)
      return res.status(404).json({ message: "Post no encontrado" });

    await db.collection("posts").deleteOne({ _id: new ObjectId(postId) });
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});
export default api;
