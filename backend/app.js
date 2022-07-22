const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

// Connexion a mongoDB
mongoose.connect('mongodb+srv://Quentin:pdL2Rvi5yywZFigz@hottakes.ovqza.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// CORS (Auth les appels de domaine à domaine --sécurisé--)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Accepte que les appels vers notre API viennent depuis presque tous les servers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// On accepte toutes les méthodes
  next();
});

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
