import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

const rootEl = document.getElementById('root');

if (rootEl) {
  try {
    const root = createRoot(rootEl);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  } catch (err: any) {
    console.error('Fatal initialization error in main.tsx:', err);
    rootEl.innerHTML = `
      <div style="min-height:100vh;background:#FBFAF6;color:#04251F;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;font-family:serif;text-align:center;">
        <div style="max-width:440px;background:#ffffff;padding:32px;border:1px solid #EFE7D8;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
          <h1 style="font-size:20px;color:#B9A06F;margin-bottom:12px;">Instytut Zdrowej Skóry Slow Skin Concept</h1>
          <p style="font-size:14px;color:#07382F;margin-bottom:20px;font-family:sans-serif;">Wystąpił problem podczas startu widoku. Kliknij poniższy przycisk, aby zresetować pamięć i uruchomić ponownie.</p>
          <button onclick="localStorage.clear();sessionStorage.clear();window.location.reload();" style="padding:10px 24px;background:#04251F;color:#ffffff;border:none;border-radius:9999px;font-size:12px;text-transform:uppercase;letter-spacing:1px;cursor:pointer;">
            Uruchom ponownie
          </button>
        </div>
      </div>
    `;
  }
}


