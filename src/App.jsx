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
import Contact from './pages/Contact'; // 1. IMPORT CONTACT
import GestureController from './components/GestureController'; 

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
            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/otp" element={<OTP />} />

            {/* MAIN APP ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/about" element={<About />} />
            
            {/* 2. ADD CONTACT ROUTE */}
            <Route path="/contact" element={<Contact />} />

            <Route path="/settings" element={<Settings />} />
            
            {/* DEFAULT REDIRECT: Start at Login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
        
        {/* Gesture Controller active on all pages */}
        <GestureController />
        
      </TransitionProvider>
    </Router>
  );
}

export default App;