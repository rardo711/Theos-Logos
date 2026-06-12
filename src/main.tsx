import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// iOS keyboard guard: focusing an input makes iOS scroll the fixed-position
// app shell upward to reveal the field, and it doesn't always scroll back
// when the keyboard closes — leaving the app shifted with a dead strip at
// the bottom edge. Snap the window back whenever focus leaves an input or
// the visual viewport returns to full size.
function restoreViewport() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
document.addEventListener('focusout', () => {
  setTimeout(restoreViewport, 50);
});
window.visualViewport?.addEventListener('resize', () => {
  const vv = window.visualViewport!;
  if (vv.height >= window.innerHeight - 1) restoreViewport();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
