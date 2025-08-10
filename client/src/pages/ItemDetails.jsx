import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Image, Badge } from 'react-bootstrap';
import { itemsAPI } from '../services/api';
import './css/ItemDetails.css';
import './css/SharedComponents.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (id.length > 20) {
        response = await itemsAPI.getItemByUniqueId(id);
      } else {
        response = await itemsAPI.getItem(id);
      }
      
      setItem(response.data);
    } catch (error) {
      console.error('Error loading item:', error);
      setError('Item not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimItem = async () => {
    if (!item || item.status === 'claimed') return;
    
    setClaiming(true);
    try {
      await itemsAPI.claimItem(item.id);
      setItem(prev => ({ ...prev, status: 'claimed' }));
      alert('Item marked as claimed successfully!');
    } catch (error) {
      console.error('Error claiming item:', error);
      alert('Failed to claim item. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'lost': return 'danger';
      case 'found': return 'success';
      case 'claimed': return 'secondary';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'lost': return '❌';
      case 'found': return '✅';
      case 'claimed': return '🎉';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGoogleMapsUrl = (lat, lon) => {
    return `https://www.google.com/maps?q=${lat},${lon}`;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="modern-loading">
          <div className="loading-container">
            <div className="loading-spinner-modern">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h5 className="mt-4 text-neo-secondary">Loading item...</h5>
            <p className="text-neo-muted">Fetching item details</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="neo-surface p-4">
          <div className="text-center">
            <div className="mb-3" style={{ fontSize: '4rem', opacity: '0.3' }}>😞</div>
            <h4 className="text-neo-primary">Error Loading Item</h4>
            <p className="text-neo-secondary mb-4">{error}</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              <svg width="16" height="16" fill="currentColor" className="me-2">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>
              </svg>
              Back to Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="neo-surface p-4">
          <div className="text-center">
            <div className="mb-3" style={{ fontSize: '4rem', opacity: '0.3' }}>🔍</div>
            <h4 className="text-neo-primary">Item Not Found</h4>
            <p className="text-neo-secondary mb-4">The requested item could not be found.</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              <svg width="16" height="16" fill="currentColor" className="me-2">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>
              </svg>
              Back to Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Back Button */}
          <Button 
            variant="outline-secondary" 
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <svg width="16" height="16" fill="currentColor" className="me-2">
              <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Back to Items
          </Button>
          
          {/* Main Item Card */}
          <Card className="neo-float fade-in">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h2 className="text-neo-primary fw-bold mb-2">{item.name}</h2>
                  <p className="text-neo-muted mb-0 d-flex align-items-center">
                    <svg width="16" height="16" fill="currentColor" className="me-2">
                      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3z"/>
                    </svg>
                    {item.category}
                  </p>
                </div>
                <Badge bg={getStatusColor(item.status)} className="fs-6 px-3 py-2">
                  {getStatusIcon(item.status)} {item.status.toUpperCase()}
                </Badge>
              </div>
              
              <Row className="g-4">
                {/* Left Column - Images */}
                <Col md={6}>
                  {item.image_path ? (
                    <div className="mb-4">
                      <Image 
                        src={`/uploads/${item.image_path}`}
                        alt={item.name}
                        className="item-details-image w-100"
                        fluid
                      />
                    </div>
                  ) : (
                    <div 
                      className="mb-4 d-flex align-items-center justify-content-center"
                      style={{
                        height: '300px',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-inset)',
                        fontSize: '4rem',
                        opacity: '0.3'
                      }}
                    >
                      📦
                    </div>
                  )}
                  
                  {/* QR Code */}
                  {item.qr_code_path && (
                    <div className="qr-code-display">
                      <h6 className="text-neo-primary fw-semibold mb-3">
                        <svg width="20" height="20" fill="currentColor" className="me-2">
                          <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h2A1.5 1.5 0 0 1 5 1.5v2A1.5 1.5 0 0 1 3.5 5h-2A1.5 1.5 0 0 1 0 3.5v-2z"/>
                        </svg>
                        QR Code
                      </h6>
                      <Image 
                        src={`/qrcodes/${item.qr_code_path}`}
                        alt="QR Code"
                        style={{ maxWidth: '200px' }}
                        className="d-block mx-auto"
                      />
                      <p className="small text-neo-muted mt-3 text-center">
                        Scan this code to quickly access this item
                      </p>
                    </div>
                  )}
                </Col>
                
                {/* Right Column - Details */}
                <Col md={6}>
                  {/* Details Table */}
                  <div className="mb-4">
                    <h6 className="text-neo-primary fw-bold mb-3">
                      <svg width="20" height="20" fill="currentColor" className="me-2">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                      </svg>
                      Item Details
                    </h6>
                    <div 
                      className="p-3"
                      style={{
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-inset)'
                      }}
                    >
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td className="text-neo-secondary fw-semibold">Unique ID:</td>
                            <td>
                              <code 
                                className="px-2 py-1"
                                style={{
                                  background: 'var(--surface)',
                                  borderRadius: 'var(--radius-sm)',
                                  boxShadow: 'var(--shadow-inset)',
                                  fontSize: '0.85rem'
                                }}
                              >
                                {item.unique_id}
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-neo-secondary fw-semibold">Reported:</td>
                            <td className="text-neo-primary">{formatDate(item.created_at)}</td>
                          </tr>
                          {item.lat && item.lon && (
                            <tr>
                              <td className="text-neo-secondary fw-semibold">Location:</td>
                              <td>
                                <a 
                                  href={getGoogleMapsUrl(item.lat, item.lon)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary btn-sm"
                                >
                                  <svg width="16" height="16" fill="currentColor" className="me-2">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                  </svg>
                                  View on Google Maps
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {item.description && (
                    <div className="mb-4">
                      <h6 className="text-neo-primary fw-bold mb-3">
                        <svg width="20" height="20" fill="currentColor" className="me-2">
                          <path d="M5 0a.5.5 0 0 1 .5.5V2h4V.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 13.5 3.5v9A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 2h1.5V.5z"/>
                        </svg>
                        Description
                      </h6>
                      <div 
                        className="p-3"
                        style={{
                          background: 'var(--surface)',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: 'var(--shadow-inset)'
                        }}
                      >
                        <p className="mb-0 text-neo-secondary">{item.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  {item.status !== 'claimed' ? (
                    <div className="d-grid">
                      <Button 
                        variant="success" 
                        size="lg"
                        onClick={handleClaimItem}
                        disabled={claiming}
                        className="py-3"
                      >
                        {claiming ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Marking as Claimed...
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" fill="currentColor" className="me-2">
                              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                            </svg>
                            Mark as Claimed
                          </>
                        )}
                      </Button>
                      <small className="text-neo-muted text-center mt-2">
                        Click this button if you have {item.status === 'lost' ? 'found' : 'reunited'} this item
                      </small>
                    </div>
                  ) : (
                    <Alert variant="success" className="neo-surface">
                      <div className="text-center py-3">
                        <div className="mb-2" style={{ fontSize: '3rem' }}>🎉</div>
                        <h5 className="text-success fw-bold mb-2">Item Claimed!</h5>
                        <p className="mb-0 text-neo-secondary">
                          This item has been successfully marked as claimed.
                        </p>
                      </div>
                    </Alert>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDetails;