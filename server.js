import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctor.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => [
  res.status(200).json({ message: "API is working fine." }),
]);
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("status-update", (data) => {
    io.emit("doctor status updated:", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
