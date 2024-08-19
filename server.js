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
    const attributes = JSON.parse(fs.readFileSync('data/product_attributes.json', 'utf8'));
    await initializeAttributes(client, attributes);

    const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
    for (const product of products) {
      await client.query(
        'INSERT INTO products (name, category, subcategory, attributes) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, subcategory = EXCLUDED.subcategory, attributes = EXCLUDED.attributes',
        [product.name, product.category, product.subcategory, JSON.stringify(product.attributes)]
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

async function initializeAttributes(client, attributes, parentCategory = null, parentSubcategory = null) {
  for (const [category, subcategories] of Object.entries(attributes)) {
    const fullCategory = parentCategory ? `${parentCategory} > ${category}` : category;
    await client.query('INSERT INTO categories (name, parent_category) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING', [fullCategory, parentCategory]);
    
    if (typeof subcategories === 'object' && !Array.isArray(subcategories)) {
      await initializeAttributes(client, subcategories, fullCategory);
    } else {
      const fullSubcategory = parentSubcategory ? `${parentSubcategory} > ${category}` : category;
      await client.query('INSERT INTO subcategories (name, category) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING', [fullSubcategory, fullCategory]);
      
      for (const attribute of subcategories) {
        await client.query(
          'INSERT INTO attributes (name, type, values, category, subcategory) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name, category, subcategory) DO UPDATE SET type = EXCLUDED.type, values = EXCLUDED.values',
          [attribute.name, attribute.type, JSON.stringify(attribute.values), fullCategory, fullSubcategory]
        );
      }
    }
  }
}

initializeDatabase().catch(console.error);

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
  const { name, category, subcategory, attributes } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (name, category, subcategory, attributes) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, subcategory, JSON.stringify(attributes)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, subcategory, attributes, human_attributes, human_verified } = req.body;
  try {
    const result = await query(
      'UPDATE products SET name = $1, category = $2, subcategory = $3, attributes = $4, human_attributes = $5, human_verified = $6 WHERE id = $7 RETURNING *',
      [name, category, subcategory, JSON.stringify(attributes), JSON.stringify(human_attributes), human_verified, id]
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

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories');
    res.json(result.rows);
  }
  catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
});

// Subcategories endpoint
app.get('/api/subcategories', async (req, res) => {
  const { category } = req.query;
  try {
    let result;
    if (category) {
      result = await query('SELECT * FROM subcategories WHERE category = $1', [category]);
    } else {
      result = await query('SELECT * FROM subcategories');
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
});

// Attributes endpoint
app.get('/api/attributes', async (req, res) => {
  const { category, subcategory, searchTerm, page = 1, limit = 20 } = req.query;
  try {
    let query = 'SELECT * FROM attributes WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (subcategory) {
      query += ` AND subcategory = $${paramCount}`;
      queryParams.push(subcategory);
      paramCount++;
    }

    if (searchTerm) {
      query += ` AND name ILIKE $${paramCount}`;
      queryParams.push(`%${searchTerm}%`);
      paramCount++;
    }

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, (page - 1) * limit);

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
});

app.post('/api/attributes', async (req, res) => {
  const { name, type, values, category, subcategory } = req.body;
  try {
    const result = await query(
      'INSERT INTO attributes (name, type, values, category, subcategory) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, type, JSON.stringify(values), category, subcategory]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating attribute:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
});

app.put('/api/attributes/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, values, category, subcategory } = req.body;
  try {
    const result = await query(
      'UPDATE attributes SET name = $1, type = $2, values = $3, category = $4, subcategory = $5 WHERE id = $6 RETURNING *',
      [name, type, JSON.stringify(values), category, subcategory, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Attribute not found' });
    }
  } catch (error) {
    console.error('Error updating attribute:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
});

app.delete('/api/attributes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM attributes WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting attribute:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
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
app.post('/api/generate', async (req, res) => {
  const { prompt, llmConfigId } = req.body;

  try {
    // Fetch LLM config
    const configResult = await query('SELECT * FROM llm_configs WHERE id = $1', [llmConfigId]);
    if (configResult.rows.length === 0) {
      return res.status(404).json({ message: 'LLM configuration not found' });
    }
    const llmConfig = configResult.rows[0];

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

    let generatedResponse;
    if (llmConfig.provider === 'openai') {
      generatedResponse = response.data.choices[0].message.content.trim();
    } else if (llmConfig.provider === 'anthropic') {
      generatedResponse = response.data.completion.trim();
    }

    res.json({ response: generatedResponse });
  } catch (error) {
    console.error('Error processing with LLM:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      message: 'Error processing with LLM', 
      error: error.response ? error.response.data : error.message,
      rawResponse: error.response ? error.response.data : null
    });
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