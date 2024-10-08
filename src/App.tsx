
import './App.css';

import ListProducts from './components/product/ListProducts';
import ListUsers from './components/user/ListUsers';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

import {createBrowserRouter, RouterProvider} from 'react-router-dom' 
import CreateProduct from './components/product/CreateProduct';
import CreateUser from './components/user/CreateUser';
import MessageBox from './components/messagebox/MessageBox';
import Login from './components/login/Login';


import GlobalContext from './global/GlobalContext';
import HistoryList from './components/history/HistoryList';
import Payment from './components/history/Payment';

function App() {

  let router = createBrowserRouter([
    {
      path: '*',
      element : <ListProducts/>
    }, 
    {
      path: '/',
      element : <ListProducts/>
    }, 
    {
      path: '/users',
      element: <ListUsers />
    },
    {
      path: '/user',
      element: <CreateUser />
    },
    {
      path: '/product/',
      element : <CreateProduct/>
    }, 
    {
      path: '/history/',
      element : <HistoryList/>
    }, 
    {
      path: '/payment/',
      element : <Payment/>
    } 
  ]);  


  return (
    <div className="App">
      <GlobalContext>
        <Login/>
        <MessageBox/>
        <Header/>      
        <RouterProvider router={router}/>
        <Footer/>
      </GlobalContext>
    </div>
  );
}

export default App;
