import React, { useState, useEffect } from 'react';
import { mockCoffeeProducts } from '../data/mockCoffeeProducts';

const HumanGraderInterface = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({
    Origin: [],
    OrganicStatus: ['Yes', 'No'],
    Intensity: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    FlavorProfile: [],
    RoastLevel: ['Light', 'Medium', 'Dark']
  });

  useEffect(() => {
    setProducts(mockCoffeeProducts);
    const initialAttributes = {
      Origin: [...new Set(mockCoffeeProducts.map(p => p.attributes.Origin))],
      OrganicStatus: ['Yes', 'No'],
      Intensity: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      FlavorProfile: [...new Set(mockCoffeeProducts.map(p => p.attributes.FlavorProfile))],
      RoastLevel: ['Light', 'Medium', 'Dark']
    };
    setAttributes(initialAttributes);
  }, []);

  const currentProduct = products[currentProductIndex];

  const handleAttributeChange = (attributeName, newValue) => {
    const updatedProducts = [...products];
    updatedProducts[currentProductIndex].attributes[attributeName] = newValue;
    setProducts(updatedProducts);
  };

  const moveToNextProduct = () => {
    if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      alert('All products verified!');
    }
  };

  const handleAddNewVariable = (attributeName, newVariable) => {
    setAttributes(prevAttributes => ({
      ...prevAttributes,
      [attributeName]: [...prevAttributes[attributeName], newVariable]
    }));
  };

  if (!currentProduct) {
    return <div className="mt-8">Loading products...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Human Grader Interface</h2>
      <h3 className="text-xl font-semibold mb-2">{currentProduct.brand} - {currentProduct.productTitle}</h3>
      <p className="mb-4">Price: ${currentProduct.price.toFixed(2)}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Attribute</th>
            <th className="border p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(currentProduct.attributes).map(([attrName, attrValue]) => (
            <tr key={attrName}>
              <td className="border p-2">{attrName}</td>
              <td className="border p-2">
                <select
                  value={attrValue}
                  onChange={(e) => handleAttributeChange(attrName, e.target.value)}
                  className="w-full p-1"
                >
                  {attributes[attrName]?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const newVariable = prompt(`Enter new variable for ${attrName}`);
                    if (newVariable) handleAddNewVariable(attrName, newVariable);
                  }}
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={moveToNextProduct}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Next Product
      </button>
      <p className="mt-2">Verifying product {currentProductIndex + 1} of {products.length}</p>
    </div>
  );
};

export default HumanGraderInterface;

