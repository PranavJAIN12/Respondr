import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
// import Home from './pages/Home'
// import router from './routers'

function App() {
  return (
    <>
    <div className="area">

    {/* <Header/>   */}
    <main >
    <Outlet/>
    </main>
    {/* <Footer/>   */}
    </div>
    </>
      );
    }
    
    export default App;