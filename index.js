const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

app.listen(3000, console.log("¡Servidor encendido!"));

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/canciones", (req, res) => {
  try {
    const getSongs = JSON.parse(fs.readFileSync("repertorio.json"));
    res.json(getSongs);
  } catch (error) {
    res.status(500).send("Error al leer las canciones");
  }
});

app.post("/canciones", (req, res) => {
  try {
    const postSong = req.body;
    const postSongs = JSON.parse(fs.readFileSync("repertorio.json"));
    postSongs.push(postSong);
    fs.writeFileSync("repertorio.json", JSON.stringify(postSongs));
    res.send("¡La canción ha sido agregada con éxito!");
  } catch (error) {
    res.status(500).send("Error al agregar la canción");
  }
});

app.put("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;
    const modifiedSong = req.body;
    const modifiedSongs = JSON.parse(fs.readFileSync("repertorio.json"));
    const index = modifiedSongs.findIndex((i) => i.id == id);
    if (index !== -1) {
      modifiedSongs[index] = modifiedSong;
      fs.writeFileSync("repertorio.json", JSON.stringify(modifiedSongs));
      res.send("¡La canción ha sido modificada con éxito!");
    } else {
      res.status(404).send("Canción no encontrada");
    }
  } catch (error) {
    res.status(500).send("Error al modificar la canción");
  }
});

app.delete("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;
    const deletedSongs = JSON.parse(fs.readFileSync("repertorio.json"));
    const index = deletedSongs.findIndex((i) => i.id == id);
    if (index !== -1) {
      deletedSongs.splice(index, 1);
      fs.writeFileSync("repertorio.json", JSON.stringify(deletedSongs));
      res.send("¡La canción ha sido eliminada con éxito!");
    } else {
      res.status(404).send("Canción no encontrada");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar la canción");
  }
});
