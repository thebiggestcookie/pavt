import React, { useState, useEffect } from 'react';
import { fetchProductsToGrade, gradeProduct } from '../utils/api';

const HumanGraderV2 = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await fetchProductsToGrade();
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
      setLoading(false);
    }
  };

  const handleGrade = async (grade) => {
    try {
      await gradeProduct(products[currentProductIndex].id, grade, feedback);
      setCurrentProductIndex(prevIndex => prevIndex + 1);
      setFeedback('');
    } catch (err) {
      setError('Failed to grade product: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>No products to grade</div>;
  if (currentProductIndex >= products.length) return <div>All products graded</div>;

  const currentProduct = products[currentProductIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Human Grader V2</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-2xl font-bold">{currentProduct.name}</h2>
        <p>Category: {currentProduct.category}</p>
        <p>Subcategory: {currentProduct.subcategory}</p>
        <h3 className="font-bold mt-2">Attributes:</h3>
        <ul className="list-disc pl-5">
          {Object.entries(currentProduct.attributes).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <label htmlFor="feedback" className="block mb-2">Feedback:</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => handleGrade('accept')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Accept
        </button>
        <button
          onClick={() => handleGrade('reject')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default HumanGraderV2;