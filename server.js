const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Load data from JSON files
let llmConfigs = JSON.parse(fs.readFileSync('data/llmConfigs.json', 'utf8'));
let prompts = JSON.parse(fs.readFileSync('data/prompts.json', 'utf8'));
let subcategories = JSON.parse(fs.readFileSync('data/subcategories.json', 'utf8'));
let attributes = JSON.parse(fs.readFileSync('data/attributes.json', 'utf8'));
let users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));
let products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

// Mock data for performance metrics
let tokenUsage = JSON.parse(fs.readFileSync('data/tokenUsage.json', 'utf8'));
let graderPerformance = JSON.parse(fs.readFileSync('data/graderPerformance.json', 'utf8'));
let llmPerformance = JSON.parse(fs.readFileSync('data/llmPerformance.json', 'utf8'));

// Helper function to save data to JSON files
function saveData(filename, data) {
  fs.writeFileSync(`data/${filename}.json`, JSON.stringify(data, null, 2));
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ token: 'fake-jwt-token', username: user.username, role: user.role });
  } else {
    res.status(400).json({ message: 'Username or password is incorrect' });
  }
});

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
  saveData('llmConfigs', llmConfigs);
  res.status(201).json(newConfig);
});

app.put('/api/llm-configs/:id', (req, res) => {
  const { id } = req.params;
  const index = llmConfigs.findIndex(config => config.id === id);
  if (index !== -1) {
    llmConfigs[index] = { ...llmConfigs[index], ...req.body };
    saveData('llmConfigs', llmConfigs);
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
  saveData('prompts', prompts);
  res.status(201).json(newPrompt);
});

app.put('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  const index = prompts.findIndex(prompt => prompt.id === id);
  if (index !== -1) {
    prompts[index] = { ...prompts[index], ...req.body };
    saveData('prompts', prompts);
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
    saveData('prompts', prompts);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Prompt not found' });
  }
});

// Subcategories endpoints
app.get('/api/subcategories', (req, res) => {
  res.json(subcategories);
});

app.post('/api/subcategories', (req, res) => {
  const newSubcategory = {
    id: Date.now().toString(),
    ...req.body
  };
  subcategories.push(newSubcategory);
  saveData('subcategories', subcategories);
  res.status(201).json(newSubcategory);
});

app.delete('/api/subcategories/:id', (req, res) => {
  const { id } = req.params;
  const index = subcategories.findIndex(subcategory => subcategory.id === id);
  if (index !== -1) {
    subcategories.splice(index, 1);
    saveData('subcategories', subcategories);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Subcategory not found' });
  }
});

// Attributes endpoints
app.get('/api/attributes', (req, res) => {
  res.json(attributes);
});

app.put('/api/attributes', (req, res) => {
  attributes = req.body;
  saveData('attributes', attributes);
  res.json(attributes);
});

// User management endpoints
app.get('/api/users', (req, res) => {
  res.json(users.map(({ password, ...user }) => user));
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    lastLogin: new Date().toISOString()
  };
  users.push(newUser);
  saveData('users', users);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    saveData('users', users);
    res.json(users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    saveData('users', users);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.post('/api/users/:id/reset-password', (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.id === id);
  if (user) {
    // In a real application, you would generate a new password or send a reset link
    res.json({ message: 'Password reset initiated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Products endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };
  products.push(newProduct);
  saveData('products', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(product => product.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    saveData('products', products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// LLM processing endpoint
app.post('/api/process-llm', async (req, res) => {
  const { prompt, productName, llmConfig } = req.body;

  try {
    let response;
    const fullPrompt = `${prompt}\n\nProduct: ${productName}\n\nPlease ensure your response is in valid JSON format. Start your response with { and end it with }.`;

    switch (llmConfig.provider) {
      case 'openai':
        response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: llmConfig.model,
          messages: [{ role: 'user', content: fullPrompt }],
          max_tokens: parseInt(llmConfig.maxTokens)
        }, {
          headers: {
            'Authorization': `Bearer ${llmConfig.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        break;
      case 'anthropic':
        response = await axios.post('https://api.anthropic.com/v1/complete', {
          prompt: fullPrompt,
          model: llmConfig.model,
          max_tokens_to_sample: parseInt(llmConfig.maxTokens)
        }, {
          headers: {
            'X-API-Key': llmConfig.apiKey,
            'Content-Type': 'application/json'
          }
        });
        break;
      default:
        throw new Error('Unsupported LLM provider');
    }

    // Parse the response and extract attributes
    let attributes;
    if (llmConfig.provider === 'openai') {
      const content = response.data.choices[0].message.content.trim();
      attributes = JSON.parse(content);
    } else if (llmConfig.provider === 'anthropic') {
      const content = response.data.completion.trim();
      attributes = JSON.parse(content);
    }

    res.json({ attributes });
  } catch (error) {
    console.error('Error processing with LLM:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      message: 'Error processing with LLM', 
      error: error.response ? error.response.data : error.message,
      rawResponse: error.response ? error.response.data : null
    });
  }
});

// Performance metrics endpoints
app.get('/api/token-usage', (req, res) => {
  const { startDate, endDate } = req.query;
  // In a real application, you would filter the data based on the date range
  res.json(tokenUsage);
});

app.get('/api/grader-performance', (req, res) => {
  const { startDate, endDate } = req.query;
  // In a real application, you would filter the data based on the date range
  res.json(graderPerformance);
});

app.get('/api/llm-performance', (req, res) => {
  const { startDate, endDate } = req.query;
  // In a real application, you would filter the data based on the date range
  res.json(llmPerformance);
});

// Regenerate attributes endpoint
app.post('/api/regenerate-attributes', async (req, res) => {
  const { promptId, llmConfigs } = req.body;
  const prompt = prompts.find(p => p.id === promptId);

  if (!prompt) {
    return res.status(404).json({ message: 'Prompt not found' });
  }

  try {
    const updatedProducts = await Promise.all(products.map(async (product) => {
      const [result1, result2] = await Promise.all([
        processWithLLM(prompt.content, product.name, llmConfigs[0]),
        processWithLLM(prompt.content, product.name, llmConfigs[1])
      ]);

      if (JSON.stringify(result1.attributes) === JSON.stringify(result2.attributes)) {
        return { ...product, attributes: result1.attributes, needsReview: false };
      } else {
        return { ...product, attributes: result1.attributes, needsReview: true };
      }
    }));

    products = updatedProducts;
    saveData('products', products);
    res.json(updatedProducts);
  } catch (error) {
    console.error('Error regenerating attributes:', error);
    res.status(500).json({ message: 'Error regenerating attributes', error: error.message });
  }
});

// Accuracy metrics endpoint
app.get('/api/accuracy-metrics/:promptId', (req, res) => {
  const { promptId } = req.params;
  const prompt = prompts.find(p => p.id === promptId);

  if (!prompt) {
    return res.status(404).json({ message: 'Prompt not found' });
  }

  const metrics = {
    accurate: 0,
    inaccurate: 0,
    missing: 0
  };

  products.forEach(product => {
    if (product.humanVerified) {
      Object.keys(product.attributes).forEach(attr => {
        if (product.attributes[attr] === product.humanAttributes[attr]) {
          metrics.accurate++;
        } else {
          metrics.inaccurate++;
        }
      });
      metrics.missing += Object.keys(product.humanAttributes).length - Object.keys(product.attributes).length;
    }
  });

  res.json(metrics);
});

// Helper function to process with LLM
async function processWithLLM(prompt, productName, llmConfig) {
  const fullPrompt = `${prompt}\n\nProduct: ${productName}\n\nPlease ensure your response is in valid JSON format. Start your response with { and end it with }.`;

  let response;
  switch (llmConfig.provider) {
    case 'openai':
      response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: llmConfig.model,
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: parseInt(llmConfig.maxTokens)
      }, {
        headers: {
          'Authorization': `Bearer ${llmConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return { attributes: JSON.parse(response.data.choices[0].message.content.trim()) };
    case 'anthropic':
      response = await axios.post('https://api.anthropic.com/v1/complete', {
        prompt: fullPrompt,
        model: llmConfig.model,
        max_tokens_to_sample: parseInt(llmConfig.maxTokens)
      }, {
        headers: {
          'X-API-Key': llmConfig.apiKey,
          'Content-Type': 'application/json'
        }
      });
      return { attributes: JSON.parse(response.data.completion.trim()) };
    default:
      throw new Error('Unsupported LLM provider');
  }
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
