import LoginScreen from './components/LoginScreen';
import MenuScreen from './components/MenuScreen';
import ContabilizacaoScreen from './components/ContabilizacaoScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import './App.css';

const OpnTasks = () => <div>OPN Tasks Component</div>;

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="/menu" element={<MenuScreen />} />
                    <Route path="/tasks" element={<OpnTasks />} />
                    <Route path="/contabilizacao" element={<ContabilizacaoScreen />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}


export default App;
