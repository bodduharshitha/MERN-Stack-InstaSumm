const express = require('express');
const cors = require('cors');
const summarizeText = require('./summarize');
const mongoose = require('mongoose');
const app = express();
const port = 5000; // Backend running on port 5000

app.use(express.json());
app.use(cors()); // Enable CORS to allow requests from the frontend

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/InstaSumm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Note schema
const noteSchema = new mongoose.Schema({
  content: String,
  color: String,
  opacity: Number,
  width: Number,
  height: Number,
  position: {
    x: Number,
    y: Number,
  },
});

const Note = mongoose.model("Note", noteSchema);

// Routes
app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  const newNote = new Note(req.body);
  await newNote.save();
  res.status(201).json(newNote);
});

app.put("/notes/:id", async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedNote);
});

app.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.post('/summarize', async (req, res) => {
  const textToSummarize = req.body.text;

  try {
    const summary = await summarizeText(textToSummarize);
    res.send({ summary });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Failed to summarize. Please check the character length.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
