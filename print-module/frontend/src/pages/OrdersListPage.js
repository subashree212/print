import React, { useState, useEffect, useCallback } from 'react';
import { getAllOrders, deleteOrder } from '../services/api';

export default function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    setDeletingId(id);
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showToast('Order deleted.');
    } catch (err) {
      setError('Failed to delete order.');
    } finally {
      setDeletingId(null);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalPages = orders.reduce((sum, o) => sum + o.pageCount * o.copies, 0);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">All Orders</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} on record</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchOrders} style={{ marginTop: '0.25rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>

   
      {orders.length > 0 && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">₹{totalRevenue.toFixed(0)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pages Printed</div>
            <div className="stat-value">{totalPages}</div>
          </div>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }}></span>
            <p style={{ marginTop: '1rem', color: 'var(--text-3)', fontSize: '0.85rem' }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖨️</div>
            <h3>No orders yet</h3>
            <p>Place your first print order to see it here.</p>
          </div>
        ) : (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Pages</th>
                  <th>Type</th>
                  <th>Copies</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id}>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontFamily: 'DM Mono, monospace' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <div className="filename" title={order.fileName}>{order.fileName}</div>
                    </td>
                    <td style={{ fontFamily: 'DM Mono, monospace', color: 'var(--text-2)' }}>{order.pageCount}</td>
                    <td>
                      <span className={`badge ${order.printType === 'COLOR' ? 'badge-color' : 'badge-bw'}`}>
                        {order.printType === 'COLOR' ? 'Color' : 'B&W'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'DM Mono, monospace', color: 'var(--text-2)' }}>×{order.copies}</td>
                    <td className="price-cell">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="date-cell">{formatDate(order.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(order.id)}
                        disabled={deletingId === order.id}
                      >
                        {deletingId === order.id ? (
                          <span className="spinner" style={{ borderTopColor: 'var(--danger)', borderColor: 'rgba(224,85,85,0.2)', width: 12, height: 12 }}></span>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast" style={{ borderColor: 'rgba(160,152,128,0.3)', color: 'var(--text-2)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
