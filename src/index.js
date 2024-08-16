import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (
  <div>
    <h1>Hello, World!</h1>
    <pre>
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
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);