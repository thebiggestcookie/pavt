import React, { useState, useEffect } from 'react';
import { fetchProductsToGrade, gradeProduct } from '../utils/api';

const HumanGrader = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      await gradeProduct(products[currentProductIndex].id, grade);
      setCurrentProductIndex(prevIndex => prevIndex + 1);
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
    <div>
      <h1>Human Grader</h1>
      <h2>{currentProduct.name}</h2>
      <p>Category: {currentProduct.category}</p>
      <p>Subcategory: {currentProduct.subcategory}</p>
      <h3>Attributes:</h3>
      <ul>
        {Object.entries(currentProduct.attributes).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      <button onClick={() => handleGrade('accept')}>Accept</button>
      <button onClick={() => handleGrade('reject')}>Reject</button>
    </div>
  );
};

export default HumanGrader;

