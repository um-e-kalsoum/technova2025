import './App.css';
import "./index.css";
import { Navbar } from './components/NavBar';
import { Home } from './components/Home';
import { About } from './components/About';
import { Project } from './components/Project';
import backgroundImage from "./assets/greenaura.jpg";


function App() {
  return (
    <>
      <Navbar />
      <section className="py-20"><Home /></section>
      <section className="py-20"><About /></section>
      <section className="py-20"><Project /></section>
    </>
  );
}

export default App;
