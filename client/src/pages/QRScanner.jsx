import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './css/QRScanner.css';
import './css/SharedComponents.css';

const QRScanner = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    setError('');
    setScannedData('');

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 300, height: 300 },
        rememberLastUsedCamera: true
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        scanner.clear();
        setIsScanning(false);
        handleScanSuccess(decodedText);
      },
      (error) => {
        console.log('Scan error:', error);
      }
    );
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      setIsScanning(false);
    }
  };

  const handleScanSuccess = (decodedText) => {
    setScannedData(decodedText);
    
    let uniqueId = decodedText;
    
    if (decodedText.includes('|')) {
      const parts = decodedText.split('|');
      uniqueId = parts[0];
    }
    
    if (uniqueId) {
      setTimeout(() => {
        navigate(`/item/${uniqueId}`);
      }, 1500);
    } else {
      setError('Invalid QR code format');
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="neo-float fade-in">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="mb-3" style={{ fontSize: '4rem' }}>📷</div>
                <h2 className="text-neo-primary fw-bold mb-3">QR Code Scanner</h2>
                <p className="text-neo-muted">
                  Scan a QR code from a Lost & Found item to view its details instantly
                </p>
              </div>
              
              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="neo-surface mb-4" dismissible onClose={() => setError('')}>
                  <div className="d-flex align-items-center">
                    <svg width="20" height="20" fill="currentColor" className="me-3 flex-shrink-0">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                    </svg>
                    {error}
                  </div>
                </Alert>
              )}
              
              {/* Scanner Container */}
              <div className="qr-scanner-container mb-4">
                <div 
                  id="qr-reader" 
                  style={{ 
                    width: '100%',
                    background: isScanning ? 'transparent' : 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: isScanning ? 'none' : 'var(--shadow-inset)',
                    minHeight: isScanning ? 'auto' : '300px',
                    display: isScanning ? 'block' : 'flex',
                    alignItems: isScanning ? 'stretch' : 'center',
                    justifyContent: isScanning ? 'stretch' : 'center'
                  }}
                >
                  {!isScanning && (
                    <div className="text-center text-neo-muted">
                      <div className="mb-3" style={{ fontSize: '3rem', opacity: '0.5' }}>📱</div>
                      <p className="mb-0">Camera preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="text-center mb-4">
                {!isScanning ? (
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={startScanning}
                    className="px-5 py-3"
                  >
                    <svg width="20" height="20" fill="currentColor" className="me-3">
                      <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                      <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                    </svg>
                    Start Camera Scanner
                  </Button>
                ) : (
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    onClick={stopScanning}
                    className="px-5 py-3"
                  >
                    <svg width="20" height="20" fill="currentColor" className="me-3">
                      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 2h2a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 9 6H7a1.5 1.5 0 0 1-1.5-1.5v-1zM7 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1A.5.5 0 0 0 9 3H7z"/>
                      <path d="M2 6h12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/>
                    </svg>
                    Stop Scanner
                  </Button>
                )}
              </div>
              
              {/* Scanned Data Display */}
              {scannedData && (
                <div 
                  className="p-4 text-center"
                  style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-inset)',
                    border: '2px solid var(--accent-green)'
                  }}
                >
                  <div className="mb-3" style={{ fontSize: '3rem' }}>✅</div>
                  <h5 className="text-success fw-bold mb-3">QR Code Scanned Successfully!</h5>
                  <div className="mb-3">
                    <strong className="text-neo-primary">Scanned Data:</strong>
                    <div 
                      className="mt-2 p-2"
                      style={{
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-sm)',
                        boxShadow: 'var(--shadow-inset)',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {scannedData}
                    </div>
                  </div>
                  <p className="text-neo-muted mb-0">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Redirecting to item details...
                  </p>
                </div>
              )}
              
              {/* Instructions */}
              <div 
                className="mt-4 p-4"
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-inset)'
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="me-3 flex-shrink-0"
                    style={{
                      background: 'var(--surface)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      boxShadow: 'var(--shadow-outset)',
                      fontSize: '1.5rem'
                    }}
                  >
                    💡
                  </div>
                  <div>
                    <h6 className="text-neo-primary fw-bold mb-3">How to use the QR Scanner:</h6>
                    <div className="text-neo-secondary">
                      <div className="d-flex align-items-start mb-2">
                        <span 
                          className="me-3 flex-shrink-0"
                          style={{
                            background: 'var(--accent-blue)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}
                        >
                          1
                        </span>
                        <span>Click "Start Camera Scanner" to activate your device's camera</span>
                      </div>
                      <div className="d-flex align-items-start mb-2">
                        <span 
                          className="me-3 flex-shrink-0"
                          style={{
                            background: 'var(--accent-blue)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}
                        >
                          2
                        </span>
                        <span>Point your camera at a Lost & Found QR code</span>
                      </div>
                      <div className="d-flex align-items-start mb-2">
                        <span 
                          className="me-3 flex-shrink-0"
                          style={{
                            background: 'var(--accent-blue)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}
                        >
                          3
                        </span>
                        <span>The scanner will automatically detect and process the code</span>
                      </div>
                      <div className="d-flex align-items-start">
                        <span 
                          className="me-3 flex-shrink-0"
                          style={{
                            background: 'var(--accent-blue)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}
                        >
                          4
                        </span>
                        <span>You'll be automatically redirected to the item's details page</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tips */}
              <div 
                className="mt-4 p-3"
                style={{
                  background: 'linear-gradient(135deg, var(--surface), var(--surface-light))',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--accent-green)',
                  boxShadow: 'var(--shadow-outset)'
                }}
              >
                <div className="d-flex align-items-center">
                  <svg width="20" height="20" fill="var(--accent-green)" className="me-3 flex-shrink-0">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                  <div>
                    <strong className="text-success">Pro Tips:</strong>
                    <span className="text-neo-secondary ms-2">
                      Ensure good lighting • Hold your device steady • Position QR code within the scanning area
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QRScanner;