import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosApi from "./api/usuarios.js";
import { MongoClient } from "mongodb";
import postsApi from "./api/posts.js";
import seguidoresApi from "./api/seguidores.js";
import mensajesApi from "./api/mensajes.js";
import dns from "dns";

// DNS de Google
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// en mongo atlas -> configurar "network access" -> ip access list -> 0.0.0.0/0
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const client = await MongoClient.connect(uri);
  app.locals.db = client.db("red-social");
  console.log("MongoDB Atlas conectado");
}

await connectDB();

app.use("/usuarios", usuariosApi);
app.use("/posts", postsApi);
app.use("/seguidores", seguidoresApi);
app.use("/mensajes", mensajesApi);

app.get("/", (req, res) => {
  res.send("welcome to my api")
})



app.listen(process.env.PORT || 3000);

export default app;


