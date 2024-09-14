import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import PrivateRoute from '../components/PrivateRoute';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import BookDemo from '../pages/BookDemo';


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
            path:"forgot-password",
            element:<ForgotPassword/>
          },
          {
            path: "reset-password",
            element:<ResetPassword/>
          },
          {
            path: "book-demo",
            element:<BookDemo/>
          },
        
          {
            path:"home",
           element:<PrivateRoute><Home/></PrivateRoute>,
          }
           
           
           
          
        ]
    }
])
export default router;