import React from 'react';
import{BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/auth/Login';
import './App.css';
import ProtectedPage from './components/ProtectedPage';
import Register from './components/auth/Register';
import Navbar from './components/navbar';
import GetPosts from './components/post/GetPosts';
import EditPost from './components/post/EditPost';
import CreatePost from './components/post/CreatePost';
import DeletePost from './components/post/DeletePost';




import EmployeeLogin from './components/EmployeeLogin';
import EmployeeDashboard from './components/EmployeeDashboard';



function App() {
  return (
   <Router>
    <div className='App'>
      <Navbar/>
<Routes>
  <Route path="/" element= {<Login />}/>
  <Route path="/login" element={<Login />}/>
  <Route path="/register" element={<Register />}/>
  <Route path="/posts" element={<GetPosts />}/>
  <Route path="/create" element={<CreatePost />}/>
  <Route path="/edit/:id" element={<EditPost />}/>
  <Route path="/delete/:id" element={<DeletePost />}/>
  <Route path="/protected" element={<ProtectedPage />}/>

   <Route path="/employee/login" element={<EmployeeLogin />} />
  <Route path="/employee/dashboard" element={<EmployeeDashboard />} /> 

  
</Routes>
       </div>
   </Router>
  );
}

export default App;
