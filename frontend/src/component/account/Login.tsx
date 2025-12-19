import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      console.log('Đăng nhập thành công!');
      toast.showToast('Đăng nhập thành công!', 'success');
      navigate('/');
    } catch (ex: any) {
      console.error('Lỗi Đăng nhập:', ex);
      const message = ex?.message || 'Đã xảy ra lỗi trong quá trình đăng nhập.';
      setError(message);
      toast.showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Bowling League
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Đăng nhập để quản lý giải đấu
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card"
          style={{
            padding: 'var(--spacing-2xl)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2
            className="text-2xl font-bold text-center mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Đăng nhập
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3 rounded-md text-sm text-center font-medium"
                style={{
                  backgroundColor: '#fee2e2',
                  color: 'var(--color-error)',
                  border: '1px solid var(--color-error)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
              style={{
                padding: '0.75rem',
                fontSize: 'var(--font-size-base)',
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo Account Info */}
          <div
            className="mt-6 p-3 rounded-md text-center text-sm"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
            }}
          >
            <p className="font-medium mb-1">Tài khoản dùng thử</p>
            <p className="text-xs">
              Email: <strong>t@gmail.com</strong> | Password:{' '}
              <strong>tungtung</strong>
            </p>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <span style={{ color: 'var(--color-text-secondary)' }}>
              Chưa có tài khoản?{' '}
            </span>
            <Link
              to="/create-account"
              style={{
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
