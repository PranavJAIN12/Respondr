// import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
// import App from /'../'
// import router from './routers'

function App() {
  return (
    <>
    <Header/>  
    <main >
    <Outlet/>
    </main>
    <Footer/>  
    </>
      );
    }
    
    export default App;