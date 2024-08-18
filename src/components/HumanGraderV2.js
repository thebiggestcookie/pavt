import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, updateProduct } from '../redux/actions/productActions';
import { fetchAttributes } from '../redux/actions/attributeActions';

const HumanGraderV2 = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  const attributes = useSelector(state => state.attributes.items);
  const loading = useSelector(state => state.products.loading || state.attributes.loading);
  const error = useSelector(state => state.products.error || state.attributes.error);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [humanAttributes, setHumanAttributes] = useState({});
  const [metrics, setMetrics] = useState({ accurate: 0, inaccurate: 0, missing: 0 });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAttributes());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0 && currentProductIndex < products.length) {
      setHumanAttributes(products[currentProductIndex].attributes || {});
    }
  }, [products, currentProductIndex]);

  const handleAttributeChange = (attribute, value) => {
    setHumanAttributes(prev => ({ ...prev, [attribute]: value }));
  };

  const handleSubmit = () => {
    const currentProduct = products[currentProductIndex];
    const updatedMetrics = { ...metrics };

    attributes.forEach(attr => {
      if (!(attr.name in currentProduct.attributes) && attr.name in humanAttributes) {
        updatedMetrics.missing++;
      } else if (humanAttributes[attr.name] !== currentProduct.attributes[attr.name]) {
        updatedMetrics.inaccurate++;
      } else {
        updatedMetrics.accurate++;
      }
    });

    dispatch(updateProduct({
      ...currentProduct,
      attributes: humanAttributes,
      humanVerified: true
    }));

    setMetrics(updatedMetrics);
    setCurrentProductIndex(prev => prev + 1);
    setHumanAttributes({});
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (products.length === 0 || attributes.length === 0) {
    return <div>No products or attributes available for grading.</div>;
  }

  if (currentProductIndex >= products.length) {
    return <div>All products have been graded!</div>;
  }

  const currentProduct = products[currentProductIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Human Grader V2</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">{currentProduct.name}</h2>
        {currentProduct.image && (
          <img src={currentProduct.image} alt={currentProduct.name} className="mb-4 max-w-xs" />
        )}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Attributes:</h3>
          {attributes.map(attr => (
            <div key={attr.name} className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {attr.name} {attr.mustHave ? '*' : ''}:
              </label>
              <select
                value={humanAttributes[attr.name] || ''}
                onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select {attr.name}</option>
                {attr.options && attr.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="__other__">Other</option>
              </select>
              {humanAttributes[attr.name] === '__other__' && (
                <input
                  type="text"
                  placeholder={`Enter custom ${attr.name}`}
                  onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit and Next
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Grading Metrics:</h3>
        <p>Accurate: {metrics.accurate}</p>
        <p>Inaccurate: {metrics.inaccurate}</p>
        <p>Missing: {metrics.missing}</p>
      </div>
    </div>
  );
};

export default HumanGraderV2;
