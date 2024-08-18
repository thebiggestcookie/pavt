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

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ token: 'fake-jwt-token', username: user.username, role: user.role });
    } else {
      res.status(400).json({ message: 'Username or password is incorrect' });
    }
  } catch (error) {
    console.error('Error during login:', error);
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
      res.status(404).json({ message: 'Config not found' });
    }
  } catch (error) {
    console.error('Error updating LLM config:', error);
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
  const { name, content } = req.body;
  try {
    const result = await query(
      'INSERT INTO prompts (name, content) VALUES ($1, $2) RETURNING *',
      [name, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/prompts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;
  try {
    const result = await query(
      'UPDATE prompts SET name = $1, content = $2 WHERE id = $3 RETURNING *',
      [name, content, id]
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

// Subcategories endpoints
app.get('/api/subcategories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM subcategories');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/subcategories', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await query(
      'INSERT INTO subcategories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/subcategories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM subcategories WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Attributes endpoints
app.get('/api/attributes', async (req, res) => {
  try {
    const result = await query('SELECT * FROM attributes');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/attributes', async (req, res) => {
  const attributes = req.body;
  try {
    await query('BEGIN');
    await query('DELETE FROM attributes');
    for (const attr of attributes) {
      await query('INSERT INTO attributes (name, type) VALUES ($1, $2)', [attr.name, attr.type]);
    }
    await query('COMMIT');
    res.json(attributes);
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error updating attributes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User management endpoints
app.get('/api/users', async (req, res) => {
  try {
    const result = await query('SELECT id, username, role, last_login FROM users');
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
      'INSERT INTO users (username, password, role, last_login) VALUES ($1, $2, $3, NOW()) RETURNING id, username, role, last_login',
      [username, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    const result = await query(
      'UPDATE users SET username = $1, password = $2, role = $3 WHERE id = $4 RETURNING id, username, role, last_login',
      [username, password, role, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
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

app.post('/api/users/:id/reset-password', async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  try {
    const result = await query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      [newPassword, id]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Password reset successful' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
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
  const { name, attributes, humanAttributes, humanVerified } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (name, attributes, human_attributes, human_verified) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, JSON.stringify(attributes), JSON.stringify(humanAttributes), humanVerified]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, attributes, humanAttributes, humanVerified } = req.body;
  try {
    const result = await query(
      'UPDATE products SET name = $1, attributes = $2, human_attributes = $3, human_verified = $4 WHERE id = $5 RETURNING *',
      [name, JSON.stringify(attributes), JSON.stringify(humanAttributes), humanVerified, id]
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
app.get('/api/token-usage', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await query('SELECT * FROM token_usage WHERE date BETWEEN $1 AND $2', [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching token usage:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/grader-performance', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await query('SELECT * FROM grader_performance WHERE date BETWEEN $1 AND $2', [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching grader performance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/llm-performance', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await query('SELECT * FROM llm_performance WHERE date BETWEEN $1 AND $2', [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching LLM performance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Regenerate attributes endpoint
app.post('/api/regenerate-attributes', async (req, res) => {
  const { promptId, llmConfigs } = req.body;
  try {
    const promptResult = await query('SELECT * FROM prompts WHERE id = $1', [promptId]);
    if (promptResult.rows.length === 0) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    const prompt = promptResult.rows[0];

    const productsResult = await query('SELECT * FROM products');
    const products = productsResult.rows;

    const updatedProducts = await Promise.all(products.map(async (product) => {
      const [result1, result2] = await Promise.all([
        processWithLLM(prompt.content, product.name, llmConfigs[0]),
        processWithLLM(prompt.content, product.name, llmConfigs[1])
      ]);

      const needsReview = JSON.stringify(result1.attributes) !== JSON.stringify(result2.attributes);
      const updatedProduct = {
        ...product,
        attributes: result1.attributes,
        needs_review: needsReview
      };

      await query(
        'UPDATE products SET attributes = $1, needs_review = $2 WHERE id = $3',
        [JSON.stringify(updatedProduct.attributes), updatedProduct.needs_review, updatedProduct.id]
      );

      return updatedProduct;
    }));

    res.json(updatedProducts);
  } catch (error) {
    console.error('Error regenerating attributes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Accuracy metrics endpoint
app.get('/api/accuracy-metrics/:promptId', async (req, res) => {
  const { promptId } = req.params;
  try {
    const promptResult = await query('SELECT * FROM prompts WHERE id = $1', [promptId]);
    if (promptResult.rows.length === 0) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    const productsResult = await query('SELECT * FROM products WHERE human_verified = true');
    const products = productsResult.rows;

    const metrics = {
      accurate: 0,
      inaccurate: 0,
      missing: 0
    };

    products.forEach(product => {
      const attributes = JSON.parse(product.attributes);
      const humanAttributes = JSON.parse(product.human_attributes);
      Object.keys(attributes).forEach(attr => {
        if (attributes[attr] === humanAttributes[attr]) {
          metrics.accurate++;
        } else {
          metrics.inaccurate++;
        }
      });
      metrics.missing += Object.keys(humanAttributes).length - Object.keys(attributes).length;
    });

    res.json(metrics);
  } catch (error) {
    console.error('Error calculating accuracy metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
