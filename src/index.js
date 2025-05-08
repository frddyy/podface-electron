import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AudioProvider } from './context/AudioContext';
import { FaceModelProvider } from './context/FaceModelContext';
import { RenderProvider } from './context/RenderContext';
import { PodcastProvider } from './context/PodcastContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AudioProvider>
      <FaceModelProvider>
        <RenderProvider>
          <PodcastProvider>
            <App />
          </PodcastProvider>
        </RenderProvider>
      </FaceModelProvider>
    </AudioProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
