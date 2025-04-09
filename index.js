const express = require("express") 
const app = express()
const bp = require("body-parser")
const cors = require("cors")
const sqlite3 = require("sqlite3")
const path = require("path")

app.use(bp.json())
app.use(bp.urlencoded())
app.use(cors())
app.use(express.static(path.join(__dirname , 'public')))

const db = new sqlite3.Database("./db.sqlite")

app.listen(8080, () => {
    console.log("O servidor foi aberto na porta 8080")
})

db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS Tarefas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tarefa VARCHAR(50) NOT NULL,
        categoria VARCHAR(50)
        )`)
})


app.get("/tarefas", (req, res) => {
    db.all(`SELECT *FROM Tarefas` , [] , (err , rows)=>{
        res.json(rows)
    })
})

app.post("/tarefa", (req, res) => {
    console.log(req.body.tarefa)
    console.log(req.body.categoria)
    db.run(`INSERT INTO Tarefas (tarefa, categoria) VALUES (?, ?)` , [req.body.tarefa , req.body.categoria])
})



app.delete("/tarefa/:index" , (req , res)=>{
   db.run(`DELETE FROM Tarefas WHERE id == (?)`,[req.params.index])
})
app.put("/tarefa/:index" , (req , res) =>{
    db.run(`UPDATE Tarefas
            SET tarefa = (?)
            WHERE id == (?)
        ` , [req.body.tarefa , req.params.index])
})
app.get("/home" , (req , res)=>{
    res.sendFile( path.join(__dirname,"index.html"))
})


















































