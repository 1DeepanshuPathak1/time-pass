import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Image, Badge } from 'react-bootstrap';
import { itemsAPI } from '../services/api';
import './css/ItemDetails.css';

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
      <div className="item-details-page">
        <Container>
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h4 className="loading-title">Loading item details...</h4>
            <p className="loading-subtitle">Please wait while we fetch the information</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-details-page">
        <Container>
          <div className="error-container">
            <div className="error-icon">😞</div>
            <h3 className="error-title">Error Loading Item</h3>
            <p className="error-message">{error}</p>
            <Button variant="primary" onClick={() => navigate('/')} className="back-home-button">
              <svg width="16" height="16" fill="currentColor" className="button-icon">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>
              </svg>
              Back to Home
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-details-page">
        <Container>
          <div className="not-found-container">
            <div className="not-found-icon">🔍</div>
            <h3 className="not-found-title">Item Not Found</h3>
            <p className="not-found-message">The requested item could not be found.</p>
            <Button variant="primary" onClick={() => navigate('/')} className="back-home-button">
              <svg width="16" height="16" fill="currentColor" className="button-icon">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>
              </svg>
              Back to Home
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="item-details-page">
      <Container>
        <Button variant="outline-secondary" className="back-button" onClick={() => navigate('/')}>
          <svg width="16" height="16" fill="currentColor" className="button-icon">
            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
          Back to Items
        </Button>
        
        <div className="item-details-card">
          <div className="card-header">
            <div className="item-header-info">
              <h1 className="item-title">{item.name}</h1>
              <div className="item-meta">
                <svg width="16" height="16" fill="currentColor" className="meta-icon">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3z"/>
                </svg>
                <span className="item-category">{item.category}</span>
              </div>
            </div>
            <Badge bg={getStatusColor(item.status)} className="status-badge">
              {getStatusIcon(item.status)} {item.status.toUpperCase()}
            </Badge>
          </div>
          
          <div className="card-content">
            <Row className="g-4">
              <Col lg={6}>
                <div className="image-section">
                  {item.image_path ? (
                    <div className="item-image-container">
                      <Image 
                        src={`/uploads/${item.image_path}`}
                        alt={item.name}
                        className="item-image"
                        fluid
                      />
                    </div>
                  ) : (
                    <div className="no-image-placeholder">
                      <div className="placeholder-icon">📦</div>
                      <p className="placeholder-text">No image available</p>
                    </div>
                  )}
                  
                  {item.qr_code_path && (
                    <div className="qr-code-section">
                      <h5 className="section-title">
                        <svg width="20" height="20" fill="currentColor" className="section-icon">
                          <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h2A1.5 1.5 0 0 1 5 1.5v2A1.5 1.5 0 0 1 3.5 5h-2A1.5 1.5 0 0 1 0 3.5v-2z"/>
                        </svg>
                        QR Code
                      </h5>
                      <div className="qr-code-container">
                        <Image 
                          src={`/qrcodes/${item.qr_code_path}`}
                          alt="QR Code"
                          className="qr-code-image"
                        />
                      </div>
                      <p className="qr-code-description">Scan this code to quickly access this item</p>
                    </div>
                  )}
                </div>
              </Col>
              
              <Col lg={6}>
                <div className="details-section">
                  <h5 className="section-title">
                    <svg width="20" height="20" fill="currentColor" className="section-icon">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    Item Details
                  </h5>
                  
                  <div className="details-table">
                    <div className="detail-row">
                      <div className="detail-label">Unique ID:</div>
                      <div className="detail-value">
                        <code className="unique-id-code">{item.unique_id}</code>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Reported:</div>
                      <div className="detail-value">{formatDate(item.created_at)}</div>
                    </div>
                    {item.lat && item.lon && (
                      <div className="detail-row">
                        <div className="detail-label">Location:</div>
                        <div className="detail-value">
                          <a 
                            href={getGoogleMapsUrl(item.lat, item.lon)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="location-link"
                          >
                            <svg width="16" height="16" fill="currentColor" className="location-icon">
                              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {item.description && (
                    <div className="description-section">
                      <h5 className="section-title">
                        <svg width="20" height="20" fill="currentColor" className="section-icon">
                          <path d="M5 0a.5.5 0 0 1 .5.5V2h4V.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 13.5 3.5v9A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 2h1.5V.5z"/>
                        </svg>
                        Description
                      </h5>
                      <div className="description-content">
                        <p>{item.description}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="action-section">
                    {item.status !== 'claimed' ? (
                      <div className="claim-section">
                        <Button 
                          variant="success" 
                          size="lg"
                          onClick={handleClaimItem}
                          disabled={claiming}
                          className="claim-button"
                        >
                          {claiming ? (
                            <>
                              <div className="spinner-border spinner-border-sm button-spinner" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Marking as Claimed...
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" fill="currentColor" className="button-icon">
                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                              </svg>
                              Mark as Claimed
                            </>
                          )}
                        </Button>
                        <p className="claim-description">
                          Click this button if you have {item.status === 'lost' ? 'found' : 'reunited'} this item
                        </p>
                      </div>
                    ) : (
                      <div className="claimed-section">
                        <div className="claimed-icon">🎉</div>
                        <h4 className="claimed-title">Item Claimed!</h4>
                        <p className="claimed-message">
                          This item has been successfully marked as claimed.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ItemDetails;