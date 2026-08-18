import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Unpaid Leave'];

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [approvingId, setApprovingId] = useState(null);
    const [approveDates, setApproveDates] = useState({ fromDate: '', toDate: '' });
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [rejectTargetId, setRejectTargetId] = useState(null);

    const fetchLeaves = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (typeFilter) params.leaveType = typeFilter;
            const response = await api.get('/admin/leaves', { params });
            setLeaves(response.data);
        } catch (err) {
            setError('Could not load leave requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeaves(); }, [statusFilter, typeFilter]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const startApprove = (leave) => {
        setApprovingId(leave.id);
        setApproveDates({ fromDate: leave.fromDate, toDate: leave.toDate });
    };

    const confirmApprove = async (id) => {
        try {
            await api.put(`/admin/leaves/${id}/status`, { status: 'APPROVED', fromDate: approveDates.fromDate, toDate: approveDates.toDate });
            setApprovingId(null);
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not approve this request');
        }
    };

    const confirmReject = async () => {
        try {
            await api.put(`/admin/leaves/${rejectTargetId}/status`, { status: 'REJECTED' });
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not reject this request');
        } finally {
            setRejectTargetId(null);
        }
    };

    return (
        <div>
            <Navbar user={user} onLogout={() => setShowLogoutConfirm(true)} />
            <div className="container">
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body p-4">
                        <h5 className="card-title mb-3"><i className="bi bi-funnel me-2 text-primary"></i>Filters</h5>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="">All</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Leave Type</label>
                                <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                    <option value="">All</option>
                                    {LEAVE_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <h5 className="card-title mb-3"><i className="bi bi-people me-2 text-primary"></i>Leave Requests</h5>
                        {loading && <p>Loading leave requests...</p>}
                        {!loading && error && <div className="alert alert-danger">{error}</div>}
                        {!loading && !error && leaves.length === 0 && (<p className="text-muted">No leave requests match this filter.</p>)}
                        {!loading && !error && leaves.length > 0 && (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {leaves.map((leave) => (
                                            <tr key={leave.id}>
                                                <td>{leave.userName}</td>
                                                <td>{leave.leaveType}</td>
                                                <td>{approvingId === leave.id ? (<input type="date" className="form-control form-control-sm" value={approveDates.fromDate} onChange={(e) => setApproveDates({ ...approveDates, fromDate: e.target.value })} />) : leave.fromDate}</td>
                                                <td>{approvingId === leave.id ? (<input type="date" className="form-control form-control-sm" value={approveDates.toDate} onChange={(e) => setApproveDates({ ...approveDates, toDate: e.target.value })} />) : leave.toDate}</td>
                                                <td>{leave.reason}</td>
                                                <td><span className={`badge ${leave.status === 'APPROVED' ? 'bg-success' : leave.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>{leave.status}</span></td>
                                                <td>
                                                    {leave.status === 'PENDING' && (
                                                        approvingId === leave.id ? (
                                                            <>
                                                                <button className="btn btn-sm btn-success me-2" onClick={() => confirmApprove(leave.id)}><i className="bi bi-check-lg"></i></button>
                                                                <button className="btn btn-sm btn-secondary" onClick={() => setApprovingId(null)}><i className="bi bi-x"></i></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="btn btn-sm btn-outline-success me-2" onClick={() => startApprove(leave)}><i className="bi bi-check-lg"></i></button>
                                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setRejectTargetId(leave.id)}><i className="bi bi-x-lg"></i></button>
                                                            </>
                                                        )
                                                    )}
                                                    {leave.status !== 'PENDING' && <span className="text-muted">—</span>}
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
            <ConfirmModal show={rejectTargetId !== null} title="Reject this leave request?" message="This action cannot be undone." onConfirm={confirmReject} onCancel={() => setRejectTargetId(null)} />
        </div>
    );
}
