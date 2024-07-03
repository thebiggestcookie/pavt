import React, { useState, useEffect } from 'react';

const AttributeManager = ({ attributes, onUpdateAttributes }) => {
  const [localAttributes, setLocalAttributes] = useState(attributes);

  useEffect(() => {
    setLocalAttributes(attributes);
  }, [attributes]);

  const handleAddVariable = (attributeName, newVariable) => {
    const updatedAttributes = {...localAttributes};
    if (!updatedAttributes[attributeName].includes(newVariable)) {
      updatedAttributes[attributeName] = [...updatedAttributes[attributeName], newVariable];
      setLocalAttributes(updatedAttributes);
      onUpdateAttributes(updatedAttributes);
    }
  };

  const handleRemoveVariable = (attributeName, variable) => {
    const updatedAttributes = {...localAttributes};
    updatedAttributes[attributeName] = updatedAttributes[attributeName].filter(v => v !== variable);
    setLocalAttributes(updatedAttributes);
    onUpdateAttributes(updatedAttributes);
  };

  return (
    <div>
      <h2>Attribute Manager</h2>
      {Object.entries(localAttributes).map(([attributeName, variables]) => (
        <div key={attributeName}>
          <h3>{attributeName}</h3>
          <ul>
            {variables.map(variable => (
              <li key={variable}>
                {variable}
                <button onClick={() => handleRemoveVariable(attributeName, variable)}>Remove</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="New variable"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddVariable(attributeName, e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AttributeManager;
