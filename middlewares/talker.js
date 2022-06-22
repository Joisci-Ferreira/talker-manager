const express = require('express');
const fs = require('fs/promises');

const talkers = express.Router();
const readFile = async () => {
  const TALKER = await fs.readFile('talker.json', 'utf-8');

  return JSON.parse(TALKER);
};

talkers.get('/', async (_req, res) => {
  const talker = await readFile();
  if (talker.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).json(talker);
});

talkers.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await readFile();

  if (!talker[Number(id)]) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const person = talker.find((talk) => talk.id === Number(id));
  return res.status(200).json(person);
});

module.exports = talkers;