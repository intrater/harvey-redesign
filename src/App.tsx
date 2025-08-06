import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Ask from './pages/Ask';
import Draft from './pages/Draft';
import Automate from './pages/Automate';
import Vault from './pages/Vault';
import Library from './pages/Library';
import Guidance from './pages/Guidance';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ask" element={<Ask />} />
          <Route path="draft" element={<Draft />} />
          <Route path="automate" element={<Automate />} />
          <Route path="vault" element={<Vault />} />
          <Route path="library" element={<Library />} />
          <Route path="guidance" element={<Guidance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;