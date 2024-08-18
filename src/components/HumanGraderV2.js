import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      const response = await axios.get('/api/products-to-grade');
      setProducts(response.data);
      if (response.data.length > 0) {
        setCurrentProduct(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
      setLoading(false);
    }
  };

  const handleGrade = async (grade) => {
    try {
      await axios.post('/api/grade-product', {
        productId: currentProduct.id,
        grade: grade
      });
      // Move to next product
      const nextProductIndex = products.findIndex(p => p.id === currentProduct.id) + 1;
      if (nextProductIndex < products.length) {
        setCurrentProduct(products[nextProductIndex]);
      } else {
        setCurrentProduct(null);
      }
    } catch (error) {
      console.error('Error grading product:', error);
      setError('Failed to grade product. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!currentProduct) {
    return <div>No more products to grade.</div>;
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
    </div>
  );
};

export default HumanGraderV2;

