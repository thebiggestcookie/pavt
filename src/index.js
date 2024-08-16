import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(1);
  const [color, setColor] = useState('black');

  const rotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  const enlarge = () => {
    setSize(prevSize => prevSize + 0.2);
  };

  const colorize = () => {
    const colors = ['red', 'blue', 'green', 'purple', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  };

  return (
    <div>
      <h1>Hello, World!</h1>
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
      <button onClick={rotate}>Rotate</button>
      <button onClick={enlarge}>Enlarge</button>
      <button onClick={colorize}>Colorize</button>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);