import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './css/QRScanner.css';

const QRScanner = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [scannedData, setScannedData] = useState('');
  const [scannerInitialized, setScannerInitialized] = useState(false);

  useEffect(() => {
    return () => {
      cleanupScanner();
    };
  }, []);

  const cleanupScanner = async () => {
    if (scannerRef.current && scannerInitialized) {
      try {
        await scannerRef.current.clear();
        setScannerInitialized(false);
      } catch (err) {
        console.warn('Scanner cleanup warning:', err);
      } finally {
        scannerRef.current = null;
        if (scannerContainerRef.current) {
          // Clear the container content safely
          const container = scannerContainerRef.current;
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      }
    }
  };

  const startScanning = async () => {
    if (isScanning || scannerInitialized) return;

    setIsScanning(true);
    setError('');
    setScannedData('');

    // Clear any existing content
    if (scannerContainerRef.current) {
      const container = scannerContainerRef.current;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        },
        false
      );

      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          setScannerInitialized(true);
          await cleanupScanner();
          setIsScanning(false);
          handleScanSuccess(decodedText);
        },
        (error) => {
          // Ignore scan errors as they happen frequently during scanning
          if (error.includes('NotFoundException')) {
            // This is normal - QR code not found in frame
            return;
          }
          console.log('Scan error:', error);
        }
      );

      setScannerInitialized(true);
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setError('Failed to start camera scanner. Please check camera permissions.');
      setIsScanning(false);
      setScannerInitialized(false);
    }
  };

  const stopScanning = async () => {
    await cleanupScanner();
    setIsScanning(false);
  };

  const handleScanSuccess = (decodedText) => {
    setScannedData(decodedText);
    
    let uniqueId = decodedText;
    
    // Parse QR code data if it contains pipe separator
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
    <div className="qr-scanner-page">
      <Container>
        <div className="scanner-container">
          <div className="scanner-header">
            <div className="header-icon">📷</div>
            <h1 className="header-title">QR Code Scanner</h1>
            <p className="header-description">
              Scan a QR code from a Lost & Found item to view its details instantly
            </p>
          </div>
          
          {error && (
            <Alert variant="danger" className="scanner-alert" dismissible onClose={() => setError('')}>
              <div className="alert-content">
                <svg width="20" height="20" fill="currentColor" className="alert-icon">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                </svg>
                <span>{error}</span>
              </div>
            </Alert>
          )}
          
          <div className="scanner-main">
            <div className="scanner-viewport">
              <div id="qr-reader" ref={scannerContainerRef}>
                {!isScanning && !scannerInitialized && (
                  <div className="scanner-placeholder">
                    <div className="placeholder-icon">📱</div>
                    <p className="placeholder-text">Camera preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="scanner-controls">
              {!isScanning && !scannerInitialized ? (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={startScanning}
                  className="control-button start-button"
                >
                  <svg width="20" height="20" fill="currentColor" className="button-icon">
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
                  className="control-button stop-button"
                  disabled={!isScanning && !scannerInitialized}
                >
                  <svg width="20" height="20" fill="currentColor" className="button-icon">
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 2h2a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 9 6H7a1.5 1.5 0 0 1-1.5-1.5v-1zM7 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1A.5.5 0 0 0 9 3H7z"/>
                    <path d="M2 6h12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/>
                  </svg>
                  Stop Scanner
                </Button>
              )}
            </div>
            
            {scannedData && (
              <div className="scan-result">
                <div className="result-icon">✅</div>
                <h4 className="result-title">QR Code Scanned Successfully!</h4>
                <div className="result-data">
                  <strong>Scanned Data:</strong>
                  <div className="data-display">{scannedData}</div>
                </div>
                <p className="result-message">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Redirecting to item details...
                </p>
              </div>
            )}
          </div>
          
          <div className="scanner-instructions">
            <div className="instructions-header">
              <div className="instructions-icon">💡</div>
              <h5 className="instructions-title">How to use the QR Scanner:</h5>
            </div>
            <div className="instructions-list">
              <div className="instruction-step">
                <span className="step-number">1</span>
                <span>Click "Start Camera Scanner" to activate your device's camera</span>
              </div>
              <div className="instruction-step">
                <span className="step-number">2</span>
                <span>Point your camera at a Lost & Found QR code</span>
              </div>
              <div className="instruction-step">
                <span className="step-number">3</span>
                <span>The scanner will automatically detect and process the code</span>
              </div>
              <div className="instruction-step">
                <span className="step-number">4</span>
                <span>You'll be automatically redirected to the item's details page</span>
              </div>
            </div>
          </div>
          
          <div className="scanner-tips">
            <div className="tips-header">
              <svg width="20" height="20" fill="var(--accent-success)" className="tips-icon">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              <strong>Pro Tips:</strong>
            </div>
            <p className="tips-text">
              Ensure good lighting • Hold your device steady • Position QR code within the scanning area • Grant camera permissions when prompted
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default QRScanner;