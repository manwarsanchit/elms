export default function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar navbar-dark mb-4" style={{ backgroundColor: 'var(--bs-primary)' }}>
            <div className="container">
                <span className="navbar-brand fw-bold">
                    <i className="bi bi-calendar-check me-2"></i>LeaveTrack
                </span>
                <div className="d-flex align-items-center text-white">
                    <span className="me-3">
                        {user.name}
                        {user.role === 'ADMIN' && <span className="badge bg-light text-dark ms-2">Admin</span>}
                    </span>
                    <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
                        <i className="bi bi-box-arrow-right me-1"></i>Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
