const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const gameRoutes = require('./routes/gameRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar MongoDB:', error);
  });

app.get('/', (req, res) => {
  res.json({
    message: 'API Game Library funcionando!!'
  });
});

// ROTAS DOS JOGOS
app.use('/games', gameRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});