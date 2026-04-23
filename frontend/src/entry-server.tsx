import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from './App';
import AuthProvider from './components/AuthProvider';

export function render(url: string) {
  const appHtml = renderToString(
    <AuthProvider>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </AuthProvider>
  );

  return appHtml;
}
