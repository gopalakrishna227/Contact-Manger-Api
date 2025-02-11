// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use('/contacts', contactRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://bgopalakrishna444:<1246812468Bgk@>@cluster0.npcj9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});