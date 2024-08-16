import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadInterface = ({ setProducts, setAttributes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = (file) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(header => header.trim());

        if (lines.length <= 1) {
          throw new Error('CSV file appears to be empty or contains only headers');
        }

        const productsData = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(value => value.trim());
          const product = { name: values[0], attributes: [] };
          for (let i = 1; i < headers.length; i++) {
            product.attributes.push({ 
              name: headers[i], 
              value: values[i] || '', 
              correct: null 
            });
          }
          return product;
        });

        setProducts(productsData);

        const initialAttributes = {};
        headers.slice(1).forEach(header => {
          initialAttributes[header] = [...new Set(productsData.map(p => 
            p.attributes.find(a => a.name === header)?.value
          ).filter(Boolean))];
        });

        setAttributes(initialAttributes);
        setError(null);
      } catch (err) {
        setError(`Error processing file: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Upload Product Data</h2>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here ...</p>
        ) : (
          <p>Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </div>
      {isLoading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Sample CSV Format:</h3>
        <pre className="bg-gray-100 p-2 rounded">
          Name,Origin,OrganicStatus,Intensity,FlavorProfile,RoastLevel
          Mountain Blend Coffee,Colombia,Yes,7,"Nutty, Chocolate",Medium
          Sunrise Espresso,Brazil,No,9,"Caramel, Citrus",Dark
        </pre>
      </div>
    </div>
  );
};

export default UploadInterface;