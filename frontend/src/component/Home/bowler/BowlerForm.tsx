// src/component/Home/BowlerForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTeams,
  fetchBowlerDetails,
  saveBowler,
} from '../../../services/api.services';

type UiTeam = { id: string; name: string };

const initialFormData = {
  bowlerId: 0,
  bowlerFirstName: '',
  bowlerLastName: '',
  bowlerMiddleInit: '',
  bowlerAddress: '',
  bowlerCity: '',
  bowlerState: '',
  bowlerZip: '',
  bowlerPhoneNumber: '',
  teamId: '',
  isDeleted: false,
};

const BowlerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = id !== undefined && id !== 'new';
  const pageTitle = isEditMode
    ? 'Chỉnh Sửa Vận Động Viên'
    : 'Tạo Vận Động Viên Mới';

  const [teamsRaw, setTeamsRaw] = useState<any[]>([]);
  const [teams, setTeams] = useState<UiTeam[]>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ------- Helpers -------
  const normalizeTeams = (list: any[]): UiTeam[] => {
    if (!Array.isArray(list)) return [];
    return list
      .map((t) => {
        const idVal = t?.TeamId ?? t?.teamId ?? t?.id ?? t?.TeamID;
        const nameVal =
          t?.teamName ??
          t?.TeamName ??
          t?.name ??
          (idVal != null ? `Team #${idVal}` : undefined);
        if (idVal == null || nameVal == null) return null;
        return { id: String(idVal), name: String(nameVal) } as UiTeam;
      })
      .filter(Boolean) as UiTeam[];
  };

  useEffect(() => {
    setTeams(normalizeTeams(teamsRaw));
  }, [teamsRaw]);

  //  data -------
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // 1) Teams
        const t = await fetchTeams();
        if (!cancelled) setTeamsRaw(Array.isArray(t) ? t : []);

        // 2) Bowler when editing
        if (isEditMode && id) {
          const b = await fetchBowlerDetails(id);
          if (!cancelled) {
            setFormData({
              ...initialFormData,
              ...b,
              teamId: (b?.teamId ?? b?.teamId ?? b?.teamId ?? '').toString(),
              bowlerZip: (b?.bowlerZip ?? '').toString(),
              bowlerMiddleInit: b?.bowlerMiddleInit ?? '',
              bowlerId: b?.bowlerId ?? b?.bowlerId ?? 0,
            });
          }
        }
      } catch (e: any) {
        if (!cancelled) setStatus(`❌ Lỗi tải dữ liệu: ${e?.message ?? e}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEditMode]);

  const selectedTeamId = formData?.teamId ? String(formData.teamId) : '';
  const hasTeams = teams.length > 0;

  // ------- Handlers -------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // ------- Handlers -------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(isEditMode ? 'Đang cập nhật...' : 'Đang tạo mới...');

    const payload = {
      ...formData,
      teamId: selectedTeamId ? parseInt(selectedTeamId, 10) : null,
      bowlerId: isEditMode ? (formData?.bowlerId ?? 0) : 0,
      isDeleted: false,
      bowlerMiddleInit: formData?.bowlerMiddleInit || null,
    };

    try {
      await saveBowler(payload, id);
      setStatus(
        `✅ ${pageTitle} thành công! Đang chuyển hướng về trang chủ...`,
      );
      setTimeout(() => navigate('/'), 1200);
    } catch (e: any) {
      setStatus(
        `❌ Lỗi ${isEditMode ? 'cập nhật' : 'tạo mới'}: ${e?.message ?? e}`,
      );
    }
  };

  // ------- UI -------
  if (isLoading) {
    return (
      <div className="text-center p-20 pt-32">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00f3ff] mx-auto"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-12 flex items-center justify-center font-inter"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="glass-panel w-full max-w-xl mx-auto p-8 rounded-2xl neon-border">
        <h1 className="text-3xl font-black mb-8 text-center text-white uppercase italic tracking-wider">
          {pageTitle}
        </h1>

        {status && (
          <p
            className={`p-4 rounded-xl mb-6 text-center font-bold border ${
              status.startsWith('❌')
                ? 'bg-red-900/30 text-red-400 border-red-500'
                : 'bg-green-900/30 text-[#00f3ff] border-[#00f3ff]'
            }`}
          >
            {status}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="bowlerFirstName"
              value={formData.bowlerFirstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
            />
            <input
              type="text"
              name="bowlerLastName"
              value={formData.bowlerLastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
            />
          </div>

          <input
            type="text"
            name="bowlerAddress"
            value={formData.bowlerAddress}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
          />

          <input
            type="text"
            name="bowlerCity"
            value={formData.bowlerCity}
            onChange={handleChange}
            placeholder="City"
            required
            className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="bowlerState"
              value={formData.bowlerState}
              onChange={handleChange}
              placeholder="State"
              required
              className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
            />
            <input
              type="text"
              name="bowlerZip"
              value={formData.bowlerZip}
              onChange={handleChange}
              placeholder="Zip Code"
              required
              className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
            />
          </div>

          <input
            type="text"
            name="bowlerPhoneNumber"
            value={formData.bowlerPhoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none"
          />

          <div>
            <label className="block mb-2 font-bold text-[#00f3ff] text-sm uppercase">
              Assign Team
            </label>
            <select
              name="teamId"
              value={selectedTeamId}
              onChange={handleChange}
              required
              className="w-full p-3 bg-[#0b0c15] text-white border border-[#2a2c39] rounded-lg focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none appearance-none"
            >
              <option value="">-- Select Team --</option>
              {hasTeams ? (
                teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  (No teams available)
                </option>
              )}
            </select>
          </div>

          <div className="pt-4 space-y-3">
            <button type="submit" className="w-full btn-primary text-lg">
              {isEditMode ? 'Update Bowler' : 'Create Bowler'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-full border border-gray-600 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BowlerForm;
