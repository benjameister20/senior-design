import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import PageSelector from './javascript/PageSelector';

ReactDOM.render(<PageSelector redirected={document.referrer}/>, document.getElementById('root'));
