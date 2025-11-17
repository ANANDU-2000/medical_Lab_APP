import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store';
import Button from '../../components/ui/Button';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.fullName}!`);
        // Redirect based on role
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error || 'Invalid login credentials' });
        toast.error(result.error || 'Invalid login credentials');
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Dual Logo Header */}
          <div className="login-header">
            <div className="logo-section">
              <div className="logo-item">
                <div className="logo-circle">🧬</div>
                <span className="logo-text">HEALit</span>
              </div>
              <div className="logo-divider">+</div>
              <div className="logo-item">
                <div className="logo-circle">🔬</div>
                <span className="logo-text">Thyrocare</span>
              </div>
            </div>
            <h1>Laboratory Management System</h1>
            <p className="subtitle">Kunnathpeedika Centre - Thrissur</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-banner">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  setErrors({...errors, email: ''});
                }}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    setErrors({...errors, password: ''});
                  }}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <Button type="submit" fullWidth icon={LogIn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="forgot-password">
              <button type="button" className="forgot-link" disabled>
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="demo-credentials">
            <p className="demo-title"><strong>Demo Credentials:</strong></p>
            <div className="demo-list">
              <div className="demo-item">
                <span className="role-badge admin">Admin</span>
                <span>admin@healit.com / admin123</span>
              </div>
              <div className="demo-item">
                <span className="role-badge staff">Staff</span>
                <span>staff@healit.com / staff123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
