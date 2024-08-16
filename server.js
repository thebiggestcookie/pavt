const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// In-memory storage for demo purposes
let llmConfigs = [];
let prompts = [];

// LLM Configs endpoints
app.get('/api/llm-configs', (req, res) => {
  res.json(llmConfigs);
});

app.post('/api/llm-configs', (req, res) => {
  const newConfig = {
    id: Date.now().toString(),
    ...req.body
  };
  llmConfigs.push(newConfig);
  res.status(201).json(newConfig);
});

app.put('/api/llm-configs/:id', (req, res) => {
  const { id } = req.params;
  const index = llmConfigs.findIndex(config => config.id === id);
  if (index !== -1) {
    llmConfigs[index] = { ...llmConfigs[index], ...req.body };
    res.json(llmConfigs[index]);
  } else {
    res.status(404).json({ message: 'Config not found' });
  }
});

// Prompts endpoints
app.get('/api/prompts', (req, res) => {
  res.json(prompts);
});

app.post('/api/prompts', (req, res) => {
  const newPrompt = {
    id: Date.now().toString(),
    ...req.body
  };
  prompts.push(newPrompt);
  res.status(201).json(newPrompt);
});

app.put('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  const index = prompts.findIndex(prompt => prompt.id === id);
  if (index !== -1) {
    prompts[index] = { ...prompts[index], ...req.body };
    res.json(prompts[index]);
  } else {
    res.status(404).json({ message: 'Prompt not found' });
  }
});

app.delete('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  const index = prompts.findIndex(prompt => prompt.id === id);
  if (index !== -1) {
    prompts.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Prompt not found' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

