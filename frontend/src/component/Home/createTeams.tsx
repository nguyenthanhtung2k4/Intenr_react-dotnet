import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Định nghĩa giao diện (interface) cho dữ liệu đội
interface TeamData {
  TeamId: string;
  TeamName: string;
  CaptainId: string;
}

// URL endpoint của API POST Team
const API_URL = 'http://localhost:5231/api/BowlingLeague/teams';
// Lưu ý: Endpoint trong Controller của bạn là /api/BowlingLeague/teams, hãy đảm bảo nó khớp

const CreateTeams: React.FC = () => {
  const navigate = useNavigate();
  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState<TeamData>({
    // Bạn có thể bỏ qua TeamId nếu nó là trường tự động tạo
    TeamId: '',
    TeamName: '',
    CaptainId: '',
  });

  // State để hiển thị thông báo trạng thái cho người dùng
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Hàm xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Đang gửi dữ liệu...');

    const payload = {
      TeamName: formData.TeamName,
      CaptainId: formData.CaptainId ? parseInt(formData.CaptainId) : null,
    };

    try {
      const response = await axios.post(API_URL, payload);

      setStatusMessage(
        `✅ Tạo đội thành công! ID đội mới: ${response.data.TeamId}`,
      );

      setFormData({
        TeamId: '',
        TeamName: '',
        CaptainId: '',
      });
    } catch (error) {
      console.error('Lỗi khi tạo đội:', error);

      if (axios.isAxiosError(error) && error.response) {
        // Lỗi từ server (ví dụ: 400 Bad Request)
        setStatusMessage(
          `❌ Lỗi: ${error.response.status} - ${error.response.data.title || 'Không thể tạo đội.'}`,
        );
      } else {
        setStatusMessage('❌ Lỗi mạng hoặc lỗi không xác định.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  function handleCreate(arg0: string): void {
    navigate('../view-teams');
  }

  console.log(statusMessage);

  return (
    <div className="full">
      <div
        style={{
          padding: '20px',
          maxWidth: '400px',
          margin: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2>Tạo Đội Bowling Mới</h2>

        <form onSubmit={handleSubmit}>
          {/* Input Tên Đội (TeamName) */}
          <div>
            <label htmlFor="TeamName">Tên Đội:</label>
            <input
              type="text"
              id="TeamName"
              name="TeamName"
              value={formData.TeamName}
              className="border p-2 rounded-md w-full"
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          {/* Input ID Đội Trưởng (CaptainId) */}
          <div>
            <label htmlFor="CaptainId">ID Đội Trưởng (Tùy chọn):</label>
            <input
              type="number" // Sử dụng type="number" cho ID
              id="CaptainId"
              name="CaptainId"
              value={formData.CaptainId}
              className="border p-2 rounded-md w-full"
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.TeamName} // Vô hiệu hóa khi đang loading hoặc Tên đội trống
            style={{
              padding: '10px 15px',
              marginTop: '15px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Đang Tạo...' : 'Tạo Đội'}
          </button>
        </form>

        {/* Hiển thị trạng thái */}
        {/* <p
          style={{
            marginTop: '20px',
            fontWeight: 'bold',
            color: statusMessage.startsWith('❌')
              ? 'red'
              : statusMessage.startsWith('✅')
                ? 'green'
                : 'black',
          }}
        >
          {statusMessage}
        </p> */}
        <br />
        <br />
        <div className="view">
          <button
            type="button"
            onClick={() => handleCreate('teams')}
            className="w-full s:w-auto bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View Teams
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeams;
