import React, { useState } from 'react';
import axios from 'axios';

// Định nghĩa giao diện (interface) cho dữ liệu đội
interface TeamData {
  TeamId: string; // Dù DB tự tạo, ta vẫn có thể dùng nó trong form, hoặc chỉ để trống nếu nó tự động
  TeamName: string;
  CaptainId: string; // Tạm thời dùng string cho input, sẽ convert sang number nếu API cần
}

// URL endpoint của API POST Team
const API_URL = 'http://localhost:5231/api/BowlingLeague/teams';
// Lưu ý: Endpoint trong Controller của bạn là /api/BowlingLeague/teams, hãy đảm bảo nó khớp

const CreateTeams: React.FC = () => {
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
      // e.target.name sẽ khớp với key trong formData (TeamName, CaptainId,...)
      [e.target.name]: e.target.value,
    });
  };

  // 2. Hàm xử lý gửi form (POST request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi submit mặc định của trình duyệt
    setIsLoading(true);
    setStatusMessage('Đang gửi dữ liệu...');

    // Chuẩn bị payload (chỉ gửi những trường API yêu cầu)
    // Nếu CaptainId trong DB là int, bạn cần chuyển đổi nó
    const payload = {
      TeamName: formData.TeamName,
      // Chuyển đổi sang số, hoặc gửi null nếu input rỗng
      CaptainId: formData.CaptainId ? parseInt(formData.CaptainId) : null,
    };

    try {
      const response = await axios.post(API_URL, payload);

      // Xử lý thành công (thường là HTTP 201 Created)
      setStatusMessage(
        `✅ Tạo đội thành công! ID đội mới: ${response.data.TeamId}`,
      );

      // Xóa form sau khi gửi thành công
      setFormData({
        TeamId: '',
        TeamName: '',
        CaptainId: '',
      });
    } catch (error) {
      // Xử lý lỗi
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

  return (
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
      <p
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
      </p>
    </div>
  );
};

export default CreateTeams;
