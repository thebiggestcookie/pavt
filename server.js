const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to query the database
const query = (text, params) => pool.query(text, params);

// Initialize database schema
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrations', '001_initial_schema.sql'), 'utf8');
    await client.query(migrationSQL);
    console.log('Database schema initialized successfully');

    // Initialize data
    const subcategories = JSON.parse(fs.readFileSync('data/subcategories.json', 'utf8'));
    for (const subcategory of subcategories) {
      await client.query('INSERT INTO subcategories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [subcategory.name]);
    }

    const attributes = JSON.parse(fs.readFileSync('data/attributes.json', 'utf8'));
    for (const attribute of attributes) {
      await client.query('INSERT INTO attributes (name, type) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING', [attribute.name, attribute.type]);
    }

    const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
    for (const product of products) {
      await client.query(
        'INSERT INTO products (name, subcategory, attributes) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET subcategory = EXCLUDED.subcategory, attributes = EXCLUDED.attributes',
        [product.name, product.subcategory, JSON.stringify(product.attributes)]
      );
    }

    await client.query('COMMIT');
    console.log('Data initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}

initializeDatabase();

// Debug endpoint to check database connection
app.get('/api/debug', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ message: 'Database connection successful', timestamp: result.rows[0].now });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ message: 'Error connecting to database', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(`Attempting login for username: ${username}`);
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(`User found: ${JSON.stringify(user)}`);
      if (user.password === password) {
        res.json({ token: 'fake-jwt-token', username: user.username, role: user.role });
      } else {
        console.log('Password incorrect');
        res.status(400).json({ message: 'Username or password is incorrect' });
      }
    } else {
      console.log('User not found');
      res.status(400).json({ message: 'Username or password is incorrect' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Prompts endpoints
app.get('/api/prompts', async (req, res) => {
  try {
    const result = await query('SELECT * FROM prompts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/prompts', async (req, res) => {
  const { name, content, step } = req.body;
  try {
    const result = await query(
      'INSERT INTO prompts (name, content, step) VALUES ($1, $2, $3) RETURNING *',
      [name, content, step]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/prompts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, content, step } = req.body;
  try {
    const result = await query(
      'UPDATE prompts SET name = $1, content = $2, step = $3 WHERE id = $4 RETURNING *',
      [name, content, step, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/prompts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM prompts WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// LLM Configs endpoints
app.get('/api/llm-configs', async (req, res) => {
  try {
    const result = await query('SELECT * FROM llm_configs');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching LLM configs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/llm-configs', async (req, res) => {
  const { name, provider, model, apiKey, maxTokens } = req.body;
  try {
    const result = await query(
      'INSERT INTO llm_configs (name, provider, model, api_key, max_tokens) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, provider, model, apiKey, maxTokens]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating LLM config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/llm-configs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, provider, model, apiKey, maxTokens } = req.body;
  try {
    const result = await query(
      'UPDATE llm_configs SET name = $1, provider = $2, model = $3, api_key = $4, max_tokens = $5 WHERE id = $6 RETURNING *',
      [name, provider, model, apiKey, maxTokens, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'LLM config not found' });
    }
  } catch (error) {
    console.error('Error updating LLM config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/llm-configs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM llm_configs WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting LLM config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, subcategory, attributes } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (name, subcategory, attributes) VALUES ($1, $2, $3) RETURNING *',
      [name, subcategory, JSON.stringify(attributes)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, subcategory, attributes, human_attributes, human_verified } = req.body;
  try {
    const result = await query(
      'UPDATE products SET name = $1, subcategory = $2, attributes = $3, human_attributes = $4, human_verified = $5 WHERE id = $6 RETURNING *',
      [name, subcategory, JSON.stringify(attributes), JSON.stringify(human_attributes), human_verified, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User management endpoints
app.get('/api/users', async (req, res) => {
  try {
    const result = await query('SELECT id, username, role FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const result = await query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM users WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Subcategories endpoint
app.get('/api/subcategories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM subcategories');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Attributes endpoint
app.get('/api/attributes', async (req, res) => {
  try {
    const result = await query('SELECT * FROM attributes');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get attributes for a specific subcategory
app.get('/api/subcategory-attributes/:subcategory', async (req, res) => {
  const { subcategory } = req.params;
  try {
    const result = await query('SELECT DISTINCT jsonb_object_keys(attributes) as attribute FROM products WHERE subcategory = $1', [subcategory]);
    const attributes = result.rows.map(row => row.attribute);
    res.json(attributes);
  } catch (error) {
    console.error('Error fetching subcategory attributes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Token usage endpoint (mock data for now)
app.get('/api/token-usage', async (req, res) => {
  const mockData = [
    { date: '2023-05-01', token_count: 1000 },
    { date: '2023-05-02', token_count: 1200 },
    { date: '2023-05-03', token_count: 950 },
  ];
  res.json(mockData);
});

// LLM performance endpoint (mock data for now)
app.get('/api/llm-performance', async (req, res) => {
  const mockData = [
    { model: 'GPT-3', accuracy: 0.85 },
    { model: 'GPT-4', accuracy: 0.92 },
    { model: 'Claude', accuracy: 0.88 },
  ];
  res.json(mockData);
});

// LLM processing endpoint
app.post('/api/process-llm', async (req, res) => {
  const { prompt, productName, subcategory, llmConfig } = req.body;

  try {
    console.log('Full Prompt:', prompt);
    console.log('LLM Config:', llmConfig);

    let response;
    switch (llmConfig.provider) {
      case 'openai':
        response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: llmConfig.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: parseInt(llmConfig.max_tokens)
        }, {
          headers: {
            'Authorization': `Bearer ${llmConfig.api_key}`,
            'Content-Type': 'application/json'
          }
        });
        break;
      case 'anthropic':
        response = await axios.post('https://api.anthropic.com/v1/complete', {
          prompt: prompt,
          model: llmConfig.model,
          max_tokens_to_sample: parseInt(llmConfig.max_tokens)
        }, {
          headers: {
            'X-API-Key': llmConfig.api_key,
            'Content-Type': 'application/json'
          }
        });
        break;
      default:
        throw new Error('Unsupported LLM provider');
    }

    console.log('LLM Response:', response.data);

    let attributes;
    if (llmConfig.provider === 'openai') {
      attributes = response.data.choices[0].message.content.trim();
    } else if (llmConfig.provider === 'anthropic') {
      attributes = response.data.completion.trim();
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

// Generate product endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    // Here you would typically call your LLM service
    // For now, we'll just return a mock response
    const mockResponse = {
      response: JSON.stringify(['Sample Product 1', 'Sample Product 2', 'Sample Product 3', 'Sample Product 4', 'Sample Product 5'])
    };
    res.json(mockResponse);
  } catch (error) {
    console.error('Error generating product:', error);
    res.status(500).json({ message: 'Error generating product', error: error.message });
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