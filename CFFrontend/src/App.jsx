import { Routes, Route, Navigate } from "react-router";
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import {checkAuth} from './authSlice';
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from './pages/AdminPanel';
import CreateProblem from './pages/createProblem';
import UpdateProblem from './pages/updateProblem';
import ProblemPage from './pages/ProblemPage'
import AdminDelete from "./pages/AdminDelete";
import AdminUpdate from "./pages/AdminUpdate";
import AdminVideo from "./pages/AdminVideo";
import AdminUpload from "./pages/AdminUpload";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/EditProfile";
import LeaderBoard from "./pages/LeaderBoard";
import Contest from "./pages/Contest";
import Discuss from "./pages/Discuss";
import GetProfile from "./pages/getProfile";
import PricingPage from "./pages/PricingPage";

function App() {


  const {isAuthenticated, user, loading} =  useSelector((state) => state.auth);
  const dispatch = useDispatch();
 

  useEffect(() => {
    dispatch(checkAuth());
  },[dispatch]);

  if(loading){
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  }

  return (
      <Routes>
  {/* Public routes - accessible without authentication */}
  <Route path="/problems" element={<Homepage />} />
  <Route path="/contests" element={<Contest />} />
  <Route path="/discuss" element={<Discuss />} />
  <Route path="/" element={<Home />} />
  <Route path="/login" element={isAuthenticated ? <Navigate to='/problems' /> : <Login />} />
  <Route path="/signup" element={isAuthenticated ? <Navigate to='/problems' /> : <Signup />} />

  {/* Protected routes - require authentication */}
  <Route path="/leaderboard" element={isAuthenticated ? <LeaderBoard /> : <Navigate to='/login' />} />
  <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to='/login' />} />
  <Route path="/editprofile" element={isAuthenticated ? <ProfileEdit /> : <Navigate to='/login' />} />
  <Route path="/problem/problemById/:problemId" element={isAuthenticated ? <ProblemPage /> : <Navigate to='/login' />} />
  <Route path="/profile/:userId" element={<GetProfile />} />
  <Route path="/pricing" element={isAuthenticated ? <PricingPage /> : <Navigate to='/login' />} />

  {/* Admin routes - require authentication AND admin role */}
  <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/problems" />} />
  <Route path="/problem/create" element={isAuthenticated && user?.role === 'admin' ? <CreateProblem /> : <Navigate to="/problems" />} />
  <Route path="/problem/update/:id" element={isAuthenticated && user?.role === 'admin' ? <UpdateProblem /> : <Navigate to="/problems" />} />
  <Route path="/problem/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/problems" />} />
  <Route path="/problem/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/problems" />} />
  <Route path="/problem/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/problems" />} />
  <Route path="/problem/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/problems" />} />
</Routes>
  ); 
}

export default App;

