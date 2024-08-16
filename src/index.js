import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(1);
  const [color, setColor] = useState('black');
  const [actions, setActions] = useState([]);

  const addAction = (actionType) => {
    const newAction = {
      type: actionType,
      timestamp: new Date().toLocaleString(),
    };
    setActions(prevActions => [...prevActions, newAction]);
  };

  const rotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
    addAction('Rotate');
  };

  const enlarge = () => {
    setSize(prevSize => prevSize + 0.2);
    addAction('Enlarge');
  };

  const colorize = () => {
    const colors = ['red', 'blue', 'green', 'purple', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
    addAction('Colorize');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Interactive Smiley Face</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <pre
            style={{
              transform: `rotate(${rotation}deg)`,
              fontSize: `${size}em`,
              color: color,
              transition: 'all 0.3s ease',
            }}
          >
            {`
   ___________
  /           \\
 /  ^     ^    \\
|  (o)   (o)    |
|      <        |
 \\    ___/     /
  \\__________/
            `}
          </pre>
        </div>
        <div>
          <button onClick={rotate} style={buttonStyle}>Rotate</button>
          <button onClick={enlarge} style={buttonStyle}>Enlarge</button>
          <button onClick={colorize} style={buttonStyle}>Colorize</button>
        </div>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Action</th>
            <th style={thStyle}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action, index) => (
            <tr key={index}>
              <td style={tdStyle}>{action.type}</td>
              <td style={tdStyle}>{action.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '12px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);