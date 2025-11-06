import { HelmetProvider } from '@vuer-ai/react-helmet-async';
import scrollContext from './contexts/scrollContext';

function App({ children, helmetContext = {} }) {

  const enableScroll = () => {
    const body = document.body;
    body.style.overflow = '';
    body.style.height = '';
  };

  const disableScroll = () => {
    const body = document.body;
    body.style.overflow = 'hidden';
    body.style.height = '100vh';
  };

  return (
    <HelmetProvider context={helmetContext}>
      <scrollContext.Provider value={{ enableScroll, disableScroll }}>
        {children}
      </scrollContext.Provider>
    </HelmetProvider>
  )
}

export default App
