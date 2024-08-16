import React from 'react';

const HumanGraderInterface = ({ products, currentProductIndex, setCurrentProductIndex, attributes, setAttributes }) => {
  const currentProduct = products[currentProductIndex];

  const handleAttributeChange = (attributeIndex, newValue) => {
    const updatedProducts = [...products];
    updatedProducts[currentProductIndex].attributes[attributeIndex].value = newValue;
    updatedProducts[currentProductIndex].attributes[attributeIndex].correct = true;
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
    return <div className="mt-8">No products to review. Please upload data first.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Human Grader Interface</h2>
      <h3 className="text-xl font-semibold mb-2">{currentProduct.name}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Attribute</th>
            <th className="border p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {currentProduct.attributes.map((attr, index) => (
            <tr key={index}>
              <td className="border p-2">{attr.name}</td>
              <td className="border p-2">
                <select
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(index, e.target.value)}
                  className="w-full p-1"
                >
                  {attributes[attr.name]?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const newVariable = prompt(`Enter new variable for ${attr.name}`);
                    if (newVariable) handleAddNewVariable(attr.name, newVariable);
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

