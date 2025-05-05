//npm install method-override
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/bookstored', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);

// Routes

// Add a new book
app.post('/add', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.redirect('/');
});

// Get all books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Update book
app.post('/update/:id', async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});

// Delete book using DELETE method
app.delete('/delete/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
