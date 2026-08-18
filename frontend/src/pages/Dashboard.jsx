import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Unpaid Leave'];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ leaveType: LEAVE_TYPES[0], fromDate: '', toDate: '', reason: '' });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [cancelTargetId, setCancelTargetId] = useState(null);

    const fetchLeaves = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/leaves');
            setLeaves(response.data);
        } catch (err) {
            setError('Could not load your leave requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const resetForm = () => {
        setForm({ leaveType: LEAVE_TYPES[0], fromDate: '', toDate: '', reason: '' });
        setEditingId(null);
        setFormError('');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/leaves/${editingId}`, form);
            } else {
                await api.post('/leaves', form);
            }
            resetForm();
            fetchLeaves();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (leave) => {
        setEditingId(leave.id);
        setForm({ leaveType: leave.leaveType, fromDate: leave.fromDate, toDate: leave.toDate, reason: leave.reason });
        setFormError('');
    };

    const confirmCancel = async () => {
        try {
            await api.delete(`/leaves/${cancelTargetId}`);
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not cancel this request');
        } finally {
            setCancelTargetId(null);
        }
    };

    return (
        <div>
            <Navbar user={user} onLogout={() => setShowLogoutConfirm(true)} />
            <div className="container">
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body p-4">
                        <h5 className="card-title mb-3">
                            <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-primary`}></i>
                            {editingId ? 'Edit Leave Request' : 'Apply for Leave'}
                        </h5>
                        {formError && <div className="alert alert-danger">{formError}</div>}
                        <form onSubmit={handleFormSubmit}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label">Leave Type</label>
                                    <select className="form-select" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                                        {LEAVE_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">From</label>
                                    <input type="date" className="form-control" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">To</label>
                                    <input type="date" className="form-control" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Reason</label>
                                    <input type="text" className="form-control" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : editingId ? 'Update Request' : 'Apply'}
                                </button>
                                {editingId && (<button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel Edit</button>)}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <h5 className="card-title mb-3"><i className="bi bi-list-check me-2 text-primary"></i>My Leave Requests</h5>
                        {loading && <p>Loading your leave requests...</p>}
                        {!loading && error && <div className="alert alert-danger">{error}</div>}
                        {!loading && !error && leaves.length === 0 && (<p className="text-muted">You haven't applied for any leave yet.</p>)}
                        {!loading && !error && leaves.length > 0 && (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead><tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {leaves.map((leave) => (
                                            <tr key={leave.id}>
                                                <td>{leave.leaveType}</td>
                                                <td>{leave.fromDate}</td>
                                                <td>{leave.toDate}</td>
                                                <td>{leave.reason}</td>
                                                <td><span className={`badge ${leave.status === 'APPROVED' ? 'bg-success' : leave.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>{leave.status}</span></td>
                                                <td>
                                                    {leave.status === 'PENDING' ? (
                                                        <>
                                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(leave)}><i className="bi bi-pencil"></i></button>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setCancelTargetId(leave.id)}><i className="bi bi-x-lg"></i></button>
                                                        </>
                                                    ) : (<span className="text-muted">—</span>)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal show={showLogoutConfirm} title="Logout?" message="Are you sure you want to sign out?" onConfirm={handleLogout} onCancel={() => setShowLogoutConfirm(false)} />
            <ConfirmModal show={cancelTargetId !== null} title="Cancel this leave request?" message="This action cannot be undone." onConfirm={confirmCancel} onCancel={() => setCancelTargetId(null)} />
        </div>
    );
}
