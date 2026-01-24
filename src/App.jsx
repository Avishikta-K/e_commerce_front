import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionProvider } from './context/TransitionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Lookbook from './pages/Lookbook';
import Login from './pages/Login'; 
import OTP from './pages/OTP';     
import Settings from './pages/Settings'; 
import About from './pages/About'; 
import Contact from './pages/Contact'; 
import GestureController from './components/GestureController'; 

// --- UPDATED: Protected Route Component ---
const ProtectedRoute = ({ children }) => {
  // Check for the real JWT token
  const token = localStorage.getItem('authToken');
  
  // Basic validation: Token must exist and be of a reasonable length
  const isAuthenticated = token && token.length > 50; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Helper component to hide Navbar/Footer on Auth pages
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/otp';

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <TransitionProvider>
        <Layout>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/otp" element={<OTP />} />

            {/* --- PROTECTED ROUTES --- */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/lookbook" element={<ProtectedRoute><Lookbook /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* DEFAULT REDIRECT */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
        <GestureController />
      </TransitionProvider>
    </Router>
  );
}

export default App;