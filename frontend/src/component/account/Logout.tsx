import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LogoutButton = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuth();

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await logout();
      console.log('Logout successful!');
      toast.showToast('Logout successfull !', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.showToast('Logout error !', 'error');
    }
  };

  return (
    <button onClick={handleLogout} className="text-red-600">
      Logout
    </button>
  );
};
