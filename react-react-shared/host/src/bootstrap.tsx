import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.scss';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<App />);
