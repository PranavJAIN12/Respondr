import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import PrivateRoute from '../components/PrivateRoute';


const  router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
           {
             path:"/",
            element:<SignUp/>,
           },
           {
            path:"login",
           element:<Login/>,
          },
        
          {
            path:"home",
           element:<PrivateRoute><Home/></PrivateRoute>,
          }
           
           
           
          
        ]
    }
])
export default router;