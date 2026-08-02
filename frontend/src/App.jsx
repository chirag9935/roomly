import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/create-listing" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <CreateListing />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;