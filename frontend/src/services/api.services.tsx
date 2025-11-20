// service/api.service.tsx
import axios from 'axios';
import { Bowler } from '../types/Bowler';
import { Team } from '../types/Team';

export interface LoginCredentials {
  email: string;
  password: string;
}

const URL_API = process.env.REACT_APP_API_URL;
const BOWLING_API_URL = `${URL_API}/BowlingLeague`;

if (!URL_API) {
  console.error('Lỗi cấu hình: Không tìm thấy REACT_APP_API_URL trong .env.');
}

// 🔑 1. KHỞI TẠO AXIOS INSTANCE VÀ QUẢN LÝ TOKEN
let authToken = localStorage.getItem('jwtToken');
const api = axios.create({
  // <--- TẠO CUSTOM AXIOS INSTANCE
  baseURL: BOWLING_API_URL,
  headers: {
    Authorization: authToken ? `Bearer ${authToken}` : '',
  },
});

// 🔑 2. HÀM LƯU TOKEN MỚI VÀ CẬP NHẬT HEADER
export const setAuthToken = (token: string | null) => {
  if (token) {
    authToken = token;
    localStorage.setItem('jwtToken', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    authToken = null;
    localStorage.removeItem('jwtToken');
    api.defaults.headers.Authorization = '';
  }
};

// Hàm tiện ích để xử lý lỗi API và ném ra lỗi có ý nghĩa hơn
const handleApiError = (error: any, functionName: string): never => {
  let errorMessage = `Lỗi khi giao tiếp với API (${functionName}).`;
  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorMessage += ` Status: ${error.response.status}. Chi tiết: ${
        error.response.data.message || JSON.stringify(error.response.data)
      }`;
      // Xóa token nếu gặp 401 (Unauthorized)
      if (error.response.status === 401) {
        setAuthToken(null);
      }
    } else if (error.request) {
      // 🔑 Sửa: Nếu không có phản hồi và request được gửi, đó là lỗi mạng/server down
      errorMessage = `Lỗi kết nối mạng (${functionName}). Vui lòng kiểm tra server.`;
    }
  } else {
    errorMessage += ` Lỗi không xác định: ${error.message}`;
  }
  console.error(`API Error in ${functionName}:`, error);
  throw new Error(errorMessage);
};

// --- BOWLER API FUNCTIONS ---

// 1. Lấy danh sách Bowlers
export const fetchAllBowlers = async (): Promise<Bowler[]> => {
  try {
    const response = await api.get('/'); // 🔑 Dùng 'api'
    return response.data || [];
  } catch (error) {
    throw handleApiError(error, 'fetchAllBowlers');
  }
};

// 2. Lấy chi tiết Bowler theo ID
export const fetchBowlerDetails = async (id: string): Promise<Bowler> => {
  try {
    const response = await api.get(`/${id}`); // 🔑 Dùng 'api'
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'fetchBowlerDetails');
  }
};

// 3. Lưu (Tạo mới hoặc Cập nhật) Bowler
export const saveBowler = async (bowlerData: any, id?: string | number) => {
  try {
    if (id && id !== 'new') {
      const response = await api.patch(`/${id}`, bowlerData); // 🔑 Dùng 'api'
      return response.data;
    } else {
      const response = await api.post('/', bowlerData); // 🔑 Dùng 'api'
      return response.data;
    }
  } catch (error) {
    throw handleApiError(error, 'saveBowler');
  }
};

// 4. Xóa mềm (Soft Delete) Bowler
export const softDeleteBowler = async (id: string) => {
  try {
    const payload = { isDeleted: true };
    const response = await api.patch(`/${id}`, payload); // 🔑 Dùng 'api'
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'softDeleteBowler');
  }
};

// --- TEAM API FUNCTIONS ---

// 5. Lấy danh sách Teams
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get(`/teams`); // 🔑 Dùng 'api'
    return response.data || [];
  } catch (error) {
    throw handleApiError(error, 'fetchTeams');
  }
};

// 6. Lấy danh sách Bowlers theo Team ID
export const fetchTeamBowlers = async (teamId: string): Promise<Bowler[]> => {
  try {
    const response = await api.get(`/teams/${teamId}/bowlers`); // 🔑 Dùng 'api'
    return response.data || [];
  } catch (error) {
    throw handleApiError(error, 'fetchTeamBowlers');
  }
};

// 7. Tạo mới Team
export const createTeam = async (teamData: {
  TeamName: string;
  CaptainId: number | null;
}) => {
  try {
    const response = await api.post(`/teams`, teamData); // 🔑 Dùng 'api'
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createTeam');
  }
};

// 8. Đăng nhập (Sử dụng POST)
// ENDPOINT: /api/BowlingLeague/login
export const loginAccount = async (
  credentials: LoginCredentials,
): Promise<void> => {
  try {
    const response = await api.post(`/login`, credentials); // 🔑 Dùng 'api'
    // 🔑 LƯU TOKEN TỪ PHẢN HỒI
    const token = response.data.token;
    if (token) {
      setAuthToken(token); // Lưu token và cập nhật header
    }
  } catch (error) {
    throw handleApiError(error, 'loginAccount');
  }
};

// 9. Kiểm tra Session (Is Authenticated)
// ENDPOINT: /api/BowlingLeague/is-authenticated
export const checkAuthStatus = async (): Promise<{
  isAuthenticated: boolean;
  userId?: string;
}> => {
  // Kiểm tra cục bộ nếu không có Token thì không cần gọi API
  if (!authToken) {
    return { isAuthenticated: false };
  }
  try {
    const response = await api.get(`/is-authenticated`); // 🔑 Dùng 'api'
    return response.data;
  } catch (error) {
    return { isAuthenticated: false };
  }
};

// 10. Đăng xuất (Sử dụng POST)
// ENDPOINT: /api/BowlingLeague/Logout
export const logoutAccount = async (): Promise<void> => {
  try {
    await api.post(`/Logout`); // 🔑 Dùng 'api'
    // 🔑 XÓA TOKEN CỤC BỘ
    setAuthToken(null);
  } catch (error) {
    console.warn('Logout API warning (might be already logged out):', error);
    setAuthToken(null);
  }
};
