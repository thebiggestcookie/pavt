const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg');

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

// Initialize database with admin user
async function initializeDatabase() {
  try {
    const userExists = await query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (userExists.rows.length === 0) {
      await query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', ['admin', 'password', 'admin']);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
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

// LLM processing endpoint
app.post('/api/process-llm', async (req, res) => {
  const { prompt, productName, subcategory, llmConfig } = req.body;

  try {
    let fullPrompt = prompt.replace('[Product Name Here]', productName);
    if (subcategory) {
      fullPrompt = fullPrompt.replace('[Subcategory Here]', subcategory);
    }

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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
