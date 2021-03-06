var express = require("express");
var path = require("path");
var fs = require("fs");
var db = require("./db/db.json");

var app = express();

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});



app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", function(err, data) {
        if (err) throw err;
        return res.json(JSON.parse(data));
    });

})

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.post("/api/notes", function(req, res) {
    let note = req.body
    note.id = Math.random() * 100
    fs.readFile("./db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        let noteList = JSON.parse(data);
        noteList.push(note);
        fs.writeFile("./db/db.json", JSON.stringify(noteList), function(err) {
            if (err) throw err;
            console.log("success!")
        })
    })

    return res.json(note);
});

app.delete("/api/notes/:id", function(req, res) {
    let id = req.params.id;
    let newNotes;
    fs.readFile("./db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        let notes = JSON.parse(data)
        newNotes = notes.filter((note) => note.id != id);
        fs.writeFile("./db/db.json", JSON.stringify(newNotes), function(err) {
            if (err) throw err
        })

    })
    res.end()
})


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});