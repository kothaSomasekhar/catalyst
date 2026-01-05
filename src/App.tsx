import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { NewbiePath } from './components/NewbiePath';
import { SkilledPath } from './components/SkilledPath';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/newbie" element={<NewbiePath />} />
                    <Route path="/skilled" element={<SkilledPath />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
