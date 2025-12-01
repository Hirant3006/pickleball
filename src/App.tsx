import { HashRouter, Routes, Route } from 'react-router-dom';
import SessionDashboard from './components/SessionDashboard';
import SessionCreate from './components/SessionCreate';
import SessionJoin from './components/SessionJoin';
import SessionView from './components/SessionView';
import SessionArchive from './components/SessionArchive';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SessionDashboard />} />
        <Route path="/create-session" element={<SessionCreate />} />
        <Route path="/join/:sessionId" element={<SessionJoin />} />
        <Route path="/session/:sessionId" element={<SessionView />} />
        <Route path="/archives" element={<SessionArchive />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
