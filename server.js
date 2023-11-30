const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to use the static files in the public folder
app.use(express.static('public'));

// Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

//redirects to the notes page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//gets all the notes
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

//creates a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = generateUniqueId(); 
  const notes = getNotes();
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

//deletes the notes based on the id
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const notes = getNotes();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    writeNotes(updatedNotes);
    res.json({ success: true, message: 'Note deleted successfully' });
  });

// Function to read notes from db.json
const getNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
  return JSON.parse(data) || [];
};

// Function to write notes to db.json
const writeNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes), 'utf8');
};

// Function to generate a unique ID for each note
const generateUniqueId = () => {

  return Date.now().toString();
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});