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