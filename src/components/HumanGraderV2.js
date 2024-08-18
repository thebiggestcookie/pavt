import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debug, getDebugLog } from '../utils/debug';

const HumanGraderV2 = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      debug('Fetching products to grade');
      const response = await axios.get('/api/products-to-grade');
      debug('Raw products response', response.data);
      
      if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
        throw new Error('Received HTML instead of JSON. Check server configuration.');
      }

      if (!Array.isArray(response.data)) {
        throw new Error('Received data is not an array');
      }

      if (response.data.length === 0) {
        setError('No products available for grading');
        setLoading(false);
        return;
      }

      setProducts(response.data);
      setCurrentProduct(response.data[0]);
      debug('Products fetched successfully', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      debug('Error fetching products', error);
      setError(`Failed to fetch products: ${error.message}`);
      setLoading(false);
    }
  };

  const handleGrade = async (grade) => {
    try {
      if (!currentProduct) {
        throw new Error('No product selected for grading');
      }
      debug('Grading product', { productId: currentProduct.id, grade });
      await axios.post('/api/grade-product', {
        productId: currentProduct.id,
        grade: grade
      });
      debug('Product graded successfully');
      // Move to next product
      const nextProductIndex = products.findIndex(p => p.id === currentProduct.id) + 1;
      if (nextProductIndex < products.length) {
        setCurrentProduct(products[nextProductIndex]);
      } else {
        setCurrentProduct(null);
        setError('No more products to grade');
      }
    } catch (error) {
      console.error('Error grading product:', error);
      debug('Error grading product', error);
      setError(`Failed to grade product: ${error.message}`);
    }
  };

  const copyDebugLog = () => {
    navigator.clipboard.writeText(getDebugLog());
    alert('Debug log copied to clipboard!');
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="text-red-500">{error}</div>
        <button
          onClick={copyDebugLog}
          className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy Debug Log
        </button>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div>
        <div>No more products to grade.</div>
        <button
          onClick={copyDebugLog}
          className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy Debug Log
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Human Grader V2</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">{currentProduct.name}</h2>
        <p className="mb-4">Subcategory: {currentProduct.subcategory}</p>
        <h3 className="text-xl font-bold mb-2">Attributes:</h3>
        <ul className="list-disc pl-5 mb-4">
          {Object.entries(currentProduct.attributes).map(([key, value]) => (
            <li key={key}>
              <span className="font-semibold">{key}:</span> {value}
            </li>
          ))}
        </ul>
        <div className="flex space-x-4">
          <button
            onClick={() => handleGrade('correct')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Correct
          </button>
          <button
            onClick={() => handleGrade('incorrect')}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Incorrect
          </button>
        </div>
      </div>
      <button
        onClick={copyDebugLog}
        className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
      >
        Copy Debug Log
      </button>
    </div>
  );
};

export default HumanGraderV2;

