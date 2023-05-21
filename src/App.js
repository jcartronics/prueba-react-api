import MIApi from './components/MIApi';
import MiNav from './components/Navbar';

function App() {
  return (
    <div>
      <MiNav />
      <h1 className='titulo'>Desafio - React Api!</h1>
      <MIApi />
    </div>
  );
}

export default App;