import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Team {
  teamId: number;
  teamName: string;
}

const CreateBowler: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    bowlerFirstName: '',
    bowlerLastName: '',
    bowlerAddress: '',
    bowlerCity: '',
    bowlerState: '',
    bowlerZip: '',
    bowlerPhoneNumber: '',
    teamId: '',
  });

  const [status, setStatus] = useState<string>('');

  // 🔹 Lấy danh sách team để chọn
  useEffect(() => {
    axios
      .get('http://localhost:5231/api/BowlingLeague/teams') // hoặc "/api/teams" nếu bạn đặt vậy
      .then((res: { data: React.SetStateAction<Team[]> }) => setTeams(res.data))
      .catch(() => setStatus('❌ Không thể tải danh sách đội'));
  }, []);

  // 🔹 Xử lý khi nhập dữ liệu
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Gửi dữ liệu tạo Bowler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('⏳ Đang tạo vận động viên...');

    try {
      // ⚠️ Không gửi bowlerId — để backend tự tăng
      const dataToSend = {
        bowlerFirstName: formData.bowlerFirstName,
        bowlerLastName: formData.bowlerLastName,
        bowlerAddress: formData.bowlerAddress,
        bowlerCity: formData.bowlerCity,
        bowlerState: formData.bowlerState,
        bowlerZip: formData.bowlerZip,
        bowlerPhoneNumber: formData.bowlerPhoneNumber,
        teamId: formData.teamId ? Number(formData.teamId) : null,
      };

      const res = await axios.post(
        'http://localhost:5231/api/BowlingLeague/',
        dataToSend,
      );

      if (res.status === 201 || res.status === 200) {
        setStatus('✅ Tạo vận động viên thành công!');
        setFormData({
          bowlerFirstName: '',
          bowlerLastName: '',
          bowlerAddress: '',
          bowlerCity: '',
          bowlerState: '',
          bowlerZip: '',
          bowlerPhoneNumber: '',
          teamId: '',
        });
      } else {
        setStatus(`⚠️ Lỗi: ${res.statusText}`);
      }
    } catch (error: any) {
      console.error('❌ Lỗi khi tạo vận động viên:', error);
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Lỗi không xác định.';
      setStatus(`❌ Tạo vận động viên thất bại: ${msg}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        ➕ Thêm vận động viên mới
      </h2>

      {status && (
        <p className="text-center mb-4 text-sm text-gray-700">{status}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="bowlerFirstName"
            value={formData.bowlerFirstName}
            onChange={handleChange}
            placeholder="Tên"
            required
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="bowlerLastName"
            value={formData.bowlerLastName}
            onChange={handleChange}
            placeholder="Họ"
            required
            className="border p-2 rounded-md"
          />
        </div>

        <input
          type="text"
          name="bowlerAddress"
          value={formData.bowlerAddress}
          onChange={handleChange}
          placeholder="Địa chỉ"
          className="border p-2 rounded-md w-full"
        />
        <input
          type="text"
          name="bowlerCity"
          value={formData.bowlerCity}
          onChange={handleChange}
          placeholder="Thành phố"
          className="border p-2 rounded-md w-full"
        />
        <input
          type="text"
          name="bowlerState"
          value={formData.bowlerState}
          onChange={handleChange}
          placeholder="Tỉnh/Bang"
          className="border p-2 rounded-md w-full"
        />
        <input
          type="text"
          name="bowlerZip"
          value={formData.bowlerZip}
          onChange={handleChange}
          placeholder="Mã bưu điện"
          className="border p-2 rounded-md w-full"
        />
        <input
          type="text"
          name="bowlerPhoneNumber"
          value={formData.bowlerPhoneNumber}
          onChange={handleChange}
          placeholder="Số điện thoại"
          required
          className="border p-2 rounded-md w-full"
        />

        <select
          name="teamId"
          value={formData.teamId}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="">-- Chọn đội --</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.teamName}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          ✅ Tạo vận động viên
        </button>
      </form>
    </div>
  );
};

export default CreateBowler;
