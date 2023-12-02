import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
import ContabilizacaoScreen from './screens/ContabilizacaoScreen';
import TasksScreen from './screens/TasksScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import './App.css';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="/menu" element={<MenuScreen />} />
                    <Route path="/tasks" element={<TasksScreen />} />
                    <Route path="/contabilizacao" element={<ContabilizacaoScreen />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}


export default App;
