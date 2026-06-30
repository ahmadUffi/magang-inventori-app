import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import CategoryList from './pages/category/CategoryList';
import ProductList from './pages/product/ProductList';
import TransactionList from './pages/transaction/TransactionList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionList /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
