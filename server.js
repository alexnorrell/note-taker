// Bring in files
const express = require('express');
const path = require('path');
const fs = require('fs');




// Initialize app to hold value of express
const app = express();

// Port
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET routes that get the html files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;

    if(title && text) {
        const newNote = {
            title,
            text,
            newId: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            // Error handling
            if (err) {
                console.error(err);
            } else {
                // Convert note to JSON object
                const parsedNote = JSON.parse(data);
    
                parsedNote.push(newNote);

                fs.writeFile('./db/db.json', 
                JSON.stringify(parsedNote, null, 4),
                (writeErr) => 
                writeErr
                    ? console.error(writeErr)
                    : console.info('Succesfully added a new note!')
                );
            }
        });
        const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);
          res.status(201).json(response);
        } else {
            res.status(500).json('Error in posting review');
        }
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});