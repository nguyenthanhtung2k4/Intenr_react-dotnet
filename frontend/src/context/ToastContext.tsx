// src/context/ToastContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

// Import component Toast để sử dụng trong Provider
import { Toast } from '../component/share/Toast';

// Định nghĩa các loại thông báo và interface
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

// 1. Khởi tạo Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 2. Component Provider
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  // messages: Mảng chứa tất cả thông báo hiện tại
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  // Hàm hiển thị thông báo mới
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    const newToast: ToastMessage = { id, message, type };

    // Thêm thông báo mới vào đầu mảng
    setMessages((prevMessages) => [newToast, ...prevMessages]);

    // Tự động xóa thông báo sau 5 giây
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id),
      );
    }, 5000); // 5000ms = 5 giây
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* ⚠️ QUAN TRỌNG: Render component Toast ở đây để nó nằm ngoài luồng DOM chính */}
      <Toast messages={messages} />
    </ToastContext.Provider>
  );
};

// 3. Custom Hook để sử dụng Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
