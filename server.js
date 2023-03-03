// Bring in files
const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4 } = require('uuid');
const uuid = v4



// Initialize app to hold value of express
const app = express();

// Port
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET routes that get the html files



app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err){
            console.log(err)
        } else {
            const notes = JSON.parse(data)
            res.json(notes)
        }
    })
});

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;

    if(title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
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
                    : res.json(newNote)
                );
            }
        });
        // const response = {
        //     status: 'success',
        //     body: newNote,
        //   };
      
        //   console.log(response);
        //   res.status(201).json(response);
        } else {
            res.status(500).json('Error in posting review');
        }
}); 

app.delete('/api/notes/:id', (req, res) =>{
    let id = req.params.id
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        // Error handling
        if (err) {
            console.error(err);
        } else {
            // Convert note to JSON object
            const parsedNote = JSON.parse(data);

            let newNotes = parsedNote.filter((n)=>{
                return n.id !== id
            })

            fs.writeFile('./db/db.json', 
            JSON.stringify(newNotes, null, 4),
            (writeErr) => 
            writeErr
                ? console.error(writeErr)
                : res.json('Note deleted successfully!')
            );
        }
    });
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

