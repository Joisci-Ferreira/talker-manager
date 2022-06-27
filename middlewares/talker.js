const express = require('express');
const fs = require('fs/promises');
const { validateToken, validateName, validateAge, validareRate,
  validateDate, validateTalk, editTalk } = require('./validateTalkers');

const talkers = express.Router();
const readFile = async () => {
  const TALKER = await fs.readFile('talker.json', 'utf-8');

  return JSON.parse(TALKER);
};

const writeFile = async (content) => {
  const stringfyContent = JSON.stringify(content, null, 2);
  await fs.writeFile('talker.json', stringfyContent);
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

talkers.post('/', validateToken, validateName, validateAge, validateTalk, validareRate,
validateDate, async (req, res) => {
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  const talker = await readFile();

  const newTalker = {
    id: Math.max(...talker.map((person) => person.id)) + 1,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };

  await writeFile([...talker, newTalker]);
  return res.status(201).json(newTalker);
});

talkers.put('/:id', validateToken, validateName, validateAge, validateTalk,
validareRate, validateDate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talker = await readFile();

  const edit = editTalk(id, name, age, talk);
  const findTalk = talker.find((person) => person.id === Number(id));
  talker.splice(findTalk, 1, edit);

  await writeFile(talker);
  return res.status(200).json(edit);
});

talkers.delete('/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talker = await readFile();

  const findTalk = talker.findIndex((person) => person.id === Number(id));
  talker.splice(findTalk, 1);
  
  await writeFile(talker);
  return res.status(204).end();
});

module.exports = talkers;