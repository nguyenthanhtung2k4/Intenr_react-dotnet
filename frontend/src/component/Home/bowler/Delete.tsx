import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  softDeleteBowler,
  fetchBowlerDetails,
} from '../../../services/api.services';

function Delete() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');
  const [bowlerName, setBowlerName] = useState('Vận động viên này');

  useEffect(() => {
    if (id) {
      fetchBowlerDetails(id)
        .then((response) => {
          setBowlerName(
            `${response.bowlerFirstName} ${response.bowlerLastName}`,
          );
        })
        .catch(() => {
          setBowlerName('Không tìm thấy tên vận động viên');
        });
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      setStatusMessage('❌ Lỗi: Không tìm thấy ID vận động viên.');
      return;
    }

    setStatusMessage(`Đang xóa mềm ${bowlerName}...`);

    try {
      await softDeleteBowler(id);

      setStatusMessage(
        `✅ Xóa mềm ${bowlerName} thành công! Đang chuyển hướng...`,
      );

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Lỗi khi xóa mềm:', error);
      setStatusMessage(
        '❌ Lỗi: Không thể xóa mềm vận động viên. Vui lòng kiểm tra API.',
      );
    }
  };

  return (
    <div
      className="min-h-screen pt-32 pb-12 flex items-center justify-center font-inter"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="glass-panel w-full max-w-md mx-auto p-12 rounded-3xl border border-red-500/50 shadow-[0_0_30px_rgba(255,0,0,0.2)] text-center">
        <h1 className="text-3xl font-black text-red-500 mb-6 uppercase italic">
          Confirm Deletion
        </h1>
        <p className="text-white text-lg mb-8">
          Are you sure you want to delete <br />
          <span className="text-[#00f3ff] font-bold text-2xl block mt-2">
            {bowlerName}
          </span>
          <span className="text-gray-500 text-sm block mt-1">
            (Action cannot be undone)
          </span>
        </p>

        <div className="space-y-4">
          <button
            onClick={handleDelete}
            disabled={statusMessage.includes('Đang xóa')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:scale-105 transition duration-300"
          >
            YES, DELETE BOWLER
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-4 text-gray-400 font-bold hover:text-white transition"
          >
            Cancel
          </button>
        </div>

        {statusMessage && (
          <p className="mt-6 font-bold animate-pulse text-[#00f3ff]">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default Delete;
