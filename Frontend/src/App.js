import './App.css';
import { WebSocketProvider } from './context/WebSocketContext';
import Home from './pages/Home';

function App() {
  return (
    <WebSocketProvider>
      <div className="App">
        <Home />
      </div>
    </WebSocketProvider>
  );
}

export default App;
