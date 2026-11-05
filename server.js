const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
require('dotenv').config()

const app = express()
// Middleware
app.use(cors())
app.use(express.json())

const db = new Database("newbooks.db")
//create table books
db.exec(`
    create table if not exists books (
    id      text primary key,
    title   text not null
    )
    `)

//create new book
app.post("/books", (req, res) => {
    const newBook = {
        id: crypto.randomUUID(),
        title: req.body.title
    }
    db.prepare("insert into books (id,title) values(?,?)").
        run(newBook.id, newBook.title)
    res.status(201).json(newBook)
})

//get all books
app.get("/books", (req, res) => {
    const books = db.prepare("select * from books order by id desc").all()
    res.status(200).json(books)
})

//update book
app.put("/books/:id", (req, res) => {
    db.prepare("update books set title= ? where id= ?")
        .run(req.body.title, req.params.id)

    res.status(200).json({ "message": "book updated" })
})
//delete book
app.delete("/books/:id", (req, res) => {
    db.prepare("delete from books where id= ?")
        .run(req.params.id)

    res.status(200).json({ "message": "book deleted" })
})

app.listen(process.env.PORT, () => console.log("server is Running"))