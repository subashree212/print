import React, { useState, useEffect, useRef, useCallback } from 'react';
import { uploadPdf, calculatePrice, createOrder } from '../services/api';

const PRINT_TYPES = [
  { value: 'BLACK_WHITE', label: 'Black & White', price: 2 },
  { value: 'COLOR', label: 'Color', price: 5 },
];

export default function NewOrderPage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [printType, setPrintType] = useState('BLACK_WHITE');
  const [copies, setCopies] = useState(1);
  const [totalPrice, setTotalPrice] = useState(null);
  const [pricePerPage, setPricePerPage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const fileInputRef = useRef();
  useEffect(() => {
    if (!pageCount || !copies || copies < 1) return;
    const selectedType = PRINT_TYPES.find(t => t.value === printType);
    const ppp = selectedType?.price || 2;
    setPricePerPage(ppp);
    setTotalPrice(ppp * pageCount * copies);
  }, [printType, pageCount, copies]);

  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported. Please select a valid PDF.');
      return;
    }
    setError('');
    setFile(selectedFile);
    setPageCount(null);
    setTotalPrice(null);
    setUploading(true);
    try {
      const result = await uploadPdf(selectedFile);
      setPageCount(result.pageCount);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process PDF. Please try again.');
      setFile(null);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleSubmit = async () => {
    if (!file || !pageCount || copies < 1) return;
    setSubmitting(true);
    setError('');
    try {
      await createOrder({
        fileName: file.name,
        pageCount,
        printType,
        copies: Number(copies),
      });
      showToast('✓ Order placed successfully!');
      
      setFile(null);
      setPageCount(null);
      setTotalPrice(null);
      setPrintType('BLACK_WHITE');
      setCopies(1);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const canSubmit = file && pageCount && copies >= 1 && !uploading && !submitting;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">New Print Order</h1>
        <p className="page-subtitle">Upload your PDF, configure options, and place your order.</p>
      </div>

      {error && <div className="error-msg">{error}</div>}


      <div className="card">
        <div className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Document
        </div>

        {!file ? (
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="upload-title">Drop your PDF here or click to browse</div>
            <div className="upload-hint">Only PDF files accepted — max 50 MB</div>
          </div>
        ) : (
          <div>
            {uploading ? (
              <div className="file-badge" style={{ borderColor: 'rgba(232,213,176,0.25)', color: 'var(--accent-dim)' }}>
                <span className="spinner"></span>
                <span>Analysing PDF...</span>
              </div>
            ) : (
              <div className="file-badge">
                <svg className="file-badge-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="file-badge-name">{file.name}</span>
                {pageCount && <span className="file-badge-pages">{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>}
              </div>
            )}
            {!uploading && (
              <button
                className="btn btn-ghost"
                style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => { setFile(null); setPageCount(null); setTotalPrice(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              >
                ✕ Remove file
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
          </svg>
          Print Options
        </div>
        <div className="two-col">
          <div className="form-group">
            <label className="form-label">Print Type</label>
            <div className="form-select-wrap">
              <select
                className="form-select"
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
              >
                {PRINT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label} — ₹{t.price}/page
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Number of Copies</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="999"
              value={copies}
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>
      </div>


      {pageCount && totalPrice !== null && (
        <div className="card">
          <div className="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Price Summary
          </div>
          <div className="price-display">
            <div className="price-label">Total Amount</div>
            <div className="price-amount">₹{totalPrice.toFixed(2)}</div>
            <div className="price-breakdown">
              {pageCount} pages × {copies} {copies === 1 ? 'copy' : 'copies'} × ₹{pricePerPage}/page
            </div>
          </div>
        </div>
      )}


      <button
        className="btn btn-primary"
        style={{ marginTop: '0.5rem' }}
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        {submitting ? (
          <><span className="spinner" style={{ borderTopColor: '#0f0f0f', borderColor: 'rgba(0,0,0,0.2)' }}></span> Placing Order...</>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Place Order
          </>
        )}
      </button>

      {toast && (
        <div className="toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
