const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Criar jogo
router.post('/', async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Listar todos os jogos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Atualizar jogo
router.put('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Excluir jogo
router.delete('/:id', async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Jogo removido com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;