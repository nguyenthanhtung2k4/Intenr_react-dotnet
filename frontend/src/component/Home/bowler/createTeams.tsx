import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../../../services/api.services';

interface TeamData {
  TeamId: string;
  TeamName: string;
  CaptainId: string;
}

const CreateTeams: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeamData>({
    TeamId: '',
    TeamName: '',
    CaptainId: '',
  });

  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.TeamName) {
      setStatusMessage('❌ Tên đội không được để trống.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Creating Team...');

    const payload = {
      TeamName: formData.TeamName,
      CaptainId: formData.CaptainId ? parseInt(formData.CaptainId) : null,
    };

    try {
      await createTeam(payload);

      setStatusMessage('✅ Team Created Successfully! Redirecting...');

      setFormData({ TeamId: '', TeamName: '', CaptainId: '' });

      setTimeout(() => {
        navigate('/view-teams');
      }, 1500);
    } catch (error: any) {
      console.error('Lỗi khi tạo đội:', error);
      setStatusMessage(error.message || '❌ Error: Could not create team.');
    } finally {
      setIsLoading(false);
    }
  };

  var handleCreate = (type: string) => {
    navigate(`/${type}`);
  };

  return (
    <div
      className="min-h-screen pt-24 pb-12 flex items-center justify-center font-inter"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="glass-panel w-full max-w-md mx-auto p-8 rounded-2xl neon-border">
        <h1 className="text-3xl font-black mb-6 text-center text-white uppercase italic tracking-wider">
          Create New Team
        </h1>

        {statusMessage && (
          <p
            className={`p-3 rounded-lg mb-4 text-center border font-bold ${statusMessage.startsWith('❌') ? 'bg-red-900/30 text-red-500 border-red-500' : 'bg-green-900/30 text-[#00f3ff] border-[#00f3ff]'}`}
          >
            {statusMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input TeamName */}
          <div>
            <label
              htmlFor="TeamName"
              className="block text-[#00f3ff] text-sm font-bold mb-2 uppercase"
            >
              Team Name
            </label>
            <input
              id="TeamName"
              type="text"
              name="TeamName"
              value={formData.TeamName}
              onChange={handleChange}
              placeholder="Enter Team Name"
              required
              className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="CaptainId"
              className="block text-[#00f3ff] text-sm font-bold mb-2 uppercase"
            >
              Captain ID (Optional)
            </label>
            <input
              id="CaptainId"
              type="text"
              name="CaptainId"
              value={formData.CaptainId}
              onChange={handleChange}
              placeholder="Enter Captain ID"
              className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isLoading || !formData.TeamName}
              className={`w-full font-bold py-3 px-4 rounded-full shadow-lg transition duration-300 uppercase tracking-wider ${isLoading || !formData.TeamName ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'btn-primary'}`}
            >
              {isLoading ? 'Creating...' : 'Create Team'}
            </button>

            <button
              type="button"
              onClick={() => handleCreate('view-teams')}
              className="w-full py-3 rounded-full border border-gray-600 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition"
            >
              Cancel / View Teams
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeams;
