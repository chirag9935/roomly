import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import ProtectedRoute from './components/ProtectedRoute';
import MyListings from './pages/MyListings';
import EditListing from './pages/EditListing';
import RoommatePreferences from './pages/RoommatePreferences';
import RoommateMatches from './pages/RoommateMatches';
import SendInquiry from './pages/SendInquiry';
import MyInquiries from './pages/MyInquiries';
import ReceivedInquiries from './pages/ReceivedInquiries';

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
        <Route path="/my-listings" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <MyListings />
          </ProtectedRoute>
        } />
        <Route path="/edit-listing/:id" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <EditListing />
          </ProtectedRoute>
        } />
        <Route path="/roommate-preferences" element={
          <ProtectedRoute>
            <RoommatePreferences />
          </ProtectedRoute>
        } />
        <Route path="/roommate-matches" element={
          <ProtectedRoute>
            <RoommateMatches />
          </ProtectedRoute>
        } />
        <Route path="/send-inquiry/:listingId" element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <SendInquiry />
          </ProtectedRoute>
        } />
        <Route path="/my-inquiries" element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <MyInquiries />
          </ProtectedRoute>
        } />
        <Route path="/inquiries" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ReceivedInquiries />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;