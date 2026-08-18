export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body text-center p-4">
                        <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: '2.5rem' }}></i>
                        <h4 className="mt-3">{title}</h4>
                        <p className="text-muted">{message}</p>
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                            <button className="btn btn-primary" onClick={onConfirm}>Yes, continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
