import React, { useState, useEffect } from 'react';

      }
      loadAttributes(selectedCategory, selectedSubcategory);
      setError('');
    } catch (error) {
      setError('Failed to save attribute: ' + error.message);
    }
  };

  const handleDeleteAttribute = async (id) => {
    try {
      setError('');
    } catch (error) {
      setError('Failed to delete attribute: ' + error.message);
    }
  };

            </div>
          ))}
          <h3 className="text-xl font-bold mb-2">Add New Attribute</h3>
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              value={newAttribute.name}
              onChange={(e) => handleNewAttributeChange('name', e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="New Attribute Name"
            />
            <select
              value={newAttribute.type}
              onChange={(e) => handleNewAttributeChange('type', e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="select">Select</option>
              <option value="multiselect">Multiselect</option>
              <option value="boolean">Boolean</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            {['select', 'multiselect'].includes(newAttribute.type) && (
              <input
                type="text"
                value={newAttribute.values.join(', ')}
                onChange={(e) => handleNewAttributeValuesChange(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Comma-separated values"
              />
            )}
            <button
              onClick={handleAddNewAttribute}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Attribute
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AttributeEditor;