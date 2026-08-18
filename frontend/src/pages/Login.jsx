import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userData } = response.data;
            login(userData, token);
            navigate(userData.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f0, #f9f7f2)' }}>
            <div className="card shadow-lg border-0 overflow-hidden" style={{ maxWidth: '900px', width: '100%', borderRadius: '20px' }}>
                <div className="row g-0">
                    <div className="col-md-6 p-5">
                        <div className="text-success fw-bold small mb-2" style={{ letterSpacing: '1px' }}>WELCOME BACK</div>
                        <h2 className="fw-bold mb-1">Log in to your account</h2>
                        <p className="text-muted mb-4">Enter your credentials to view leave balances and requests.</p>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Email Address</label>
                                <input type="email" className="form-control form-control-lg bg-light border-0" style={{ borderRadius: '10px' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Password</label>
                                <input type="password" className="form-control form-control-lg bg-light border-0" style={{ borderRadius: '10px' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" style={{ borderRadius: '10px' }} disabled={loading}>
                                {loading ? 'Logging in...' : 'Continue'}
                            </button>
                        </form>
                        <p className="text-center mt-4 mb-0 text-muted">Don't have an account? <Link to="/register" className="fw-semibold">Register here</Link></p>
                    </div>
                    <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center position-relative" style={{ backgroundColor: 'var(--bs-primary)' }}>
                        <div className="position-absolute rounded-circle" style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.15)', top: '15%', left: '15%' }}></div>
                        <div className="position-absolute rounded-circle" style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.15)', bottom: '20%', right: '20%' }}></div>
                        <i className="bi bi-calendar2-check text-white" style={{ fontSize: '6rem' }}></i>
                        <h4 className="text-white fw-bold mt-4 text-center px-4">Employee Leave Management System</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
