const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// In-memory storage for demo purposes
let llmConfigs = [
  {
    id: '1',
    name: 'OpenAI GPT-3.5',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: 'your-openai-api-key-here',
    maxTokens: 150
  },
  {
    id: '2',
    name: 'Anthropic Claude',
    provider: 'anthropic',
    model: 'claude-v1',
    apiKey: 'your-anthropic-api-key-here',
    maxTokens: 150
  }
];
let prompts = [
  { id: '1', name: 'Coffee Attribute Extractor', content: 'Extract attributes from the given coffee product description. Return the result as a JSON object with the following structure: {"Origin": "...", "RoastLevel": "...", "FlavorProfile": "...", "Organic": "...", "FairTrade": "...", "ProcessingMethod": "..."}. Use "Unknown" if an attribute is not mentioned.' },
  { id: '2', name: 'Coffee Categorizer', content: 'Categorize the given coffee product into appropriate subcategories. Return the result as a JSON object with the following structure: {"Subcategory": "..."}. Choose from: "Whole Bean Coffee", "Ground Coffee", or "Coffee Pods".' },
];
let subcategories = [
  { id: '1', name: 'Whole Bean Coffee', parentCategory: 'Coffee' },
  { id: '2', name: 'Ground Coffee', parentCategory: 'Coffee' },
  { id: '3', name: 'Coffee Pods', parentCategory: 'Coffee' },
];
let attributes = {
  'Whole Bean Coffee': {
    'Origin': ['Colombia', 'Ethiopia', 'Brazil', 'Kenya', 'Guatemala'],
    'Roast Level': ['Light', 'Medium', 'Dark', 'French'],
    'Flavor Profile': ['Fruity', 'Nutty', 'Chocolatey', 'Floral', 'Spicy'],
    'Organic': ['Yes', 'No'],
    'Fair Trade': ['Yes', 'No'],
    'Processing Method': ['Washed', 'Natural', 'Honey'],
  },
  'Ground Coffee': {
    'Origin': ['Colombia', 'Ethiopia', 'Brazil', 'Kenya', 'Guatemala'],
    'Roast Level': ['Light', 'Medium', 'Dark', 'French'],
    'Grind Size': ['Fine', 'Medium', 'Coarse'],
    'Flavor Profile': ['Fruity', 'Nutty', 'Chocolatey', 'Floral', 'Spicy'],
    'Organic': ['Yes', 'No'],
    'Fair Trade': ['Yes', 'No'],
  },
  'Coffee Pods': {
    'Origin': ['Colombia', 'Ethiopia', 'Brazil', 'Kenya', 'Guatemala'],
    'Roast Level': ['Light', 'Medium', 'Dark'],
    'Flavor Profile': ['Fruity', 'Nutty', 'Chocolatey', 'Floral', 'Spicy'],
    'Organic': ['Yes', 'No'],
    'Fair Trade': ['Yes', 'No'],
    'Compatibility': ['Keurig', 'Nespresso', 'Tassimo'],
  },
};
let users = [];
let products = [
  {
    id: 1,
    name: "Mountain Blend Coffee",
    subcategory: "Whole Bean Coffee",
    attributes: {
      Origin: "Colombia",
      'Roast Level': "Medium",
      'Flavor Profile': "Nutty, Chocolatey",
      Organic: "Yes",
      'Fair Trade': "Yes",
      'Processing Method': "Washed"
    }
  },
  {
    id: 2,
    name: "Sunrise Espresso",
    subcategory: "Ground Coffee",
    attributes: {
      Origin: "Brazil",
      'Roast Level': "Dark",
      'Grind Size': "Fine",
      'Flavor Profile': "Chocolatey, Spicy",
      Organic: "No",
      'Fair Trade': "Yes"
    }
  },
  {
    id: 3,
    name: "Tropical Paradise Coffee Pods",
    subcategory: "Coffee Pods",
    attributes: {
      Origin: "Ethiopia",
      'Roast Level': "Light",
      'Flavor Profile': "Fruity, Floral",
      Organic: "Yes",
      'Fair Trade': "No",
      Compatibility: "Keurig"
    }
  }
];

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
  res.status(201).json(newSubcategory);
});

app.delete('/api/subcategories/:id', (req, res) => {
  const { id } = req.params;
  const index = subcategories.findIndex(subcategory => subcategory.id === id);
  if (index !== -1) {
    subcategories.splice(index, 1);
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
  res.json(attributes);
});

// User management endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    lastLogin: new Date().toISOString()
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
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

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(product => product.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
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
    const fullPrompt = `${prompt}\n\nProduct: ${productName}`;

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
      attributes = JSON.parse(response.data.choices[0].message.content);
    } else if (llmConfig.provider === 'anthropic') {
      attributes = JSON.parse(response.data.completion);
    }

    res.json({ attributes });
  } catch (error) {
    console.error('Error processing with LLM:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error processing with LLM', error: error.response ? error.response.data : error.message });
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