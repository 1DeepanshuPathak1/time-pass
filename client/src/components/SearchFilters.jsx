import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { itemsAPI } from '../services/api';
import './css/SearchFilters.css';

const SearchFilters = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    category: '',
    unique_id: '',
    lat: '',
    lon: '',
    radius: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await itemsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      status: '',
      category: '',
      unique_id: '',
      lat: '',
      lon: '',
      radius: ''
    };
    setFilters(resetFilters);
    setLocationEnabled(false);
    onReset();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters(prev => ({
            ...prev,
            lat: position.coords.latitude.toString(),
            lon: position.coords.longitude.toString(),
            radius: prev.radius || '5'
          }));
          setLocationEnabled(true);
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser settings.');
          setGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Card className="search-filters-card fade-in">
      <Card.Body>
        <div className="d-flex align-items-center mb-4">
          <div className="filter-icon me-4">
            🔍
          </div>
          <div>
            <h5 className="mb-1 fw-bold text-neo-primary">Search & Filter</h5>
            <p className="mb-0 text-neo-muted small">Find exactly what you're looking for</p>
          </div>
        </div>
        
        <Form onSubmit={handleSearch}>
          <Row className="g-4">
            {/* Keyword Search */}
            <Col md={6}>
              <Form.Group className="search-input-group">
                <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                  <svg width="16" height="16" fill="currentColor" className="me-2">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                  Keyword Search
                </Form.Label>
                <Form.Control
                  type="text"
                  name="keyword"
                  placeholder="Search by name or description..."
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  className="modern-input"
                />
              </Form.Group>
            </Col>
            
            {/* Unique ID */}
            <Col md={6}>
              <Form.Group className="search-input-group">
                <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                  <svg width="16" height="16" fill="currentColor" className="me-2">
                    <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4zm0 1h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3z"/>
                  </svg>
                  Unique ID
                </Form.Label>
                <Form.Control
                  type="text"
                  name="unique_id"
                  placeholder="Enter unique item ID..."
                  value={filters.unique_id}
                  onChange={handleFilterChange}
                  className="modern-input"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="g-4 mt-1">
            {/* Status Filter */}
            <Col md={6}>
              <Form.Group className="search-input-group">
                <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                  <svg width="16" height="16" fill="currentColor" className="me-2">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                  Status
                </Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="modern-select"
                >
                  <option value="">All Status</option>
                  <option value="lost">❌ Lost</option>
                  <option value="found">✅ Found</option>
                  <option value="claimed">🎉 Claimed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            {/* Category Filter */}
            <Col md={6}>
              <Form.Group className="search-input-group">
                <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                  <svg width="16" height="16" fill="currentColor" className="me-2">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3z"/>
                    <path d="M9 2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3z"/>
                    <path d="M1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3z"/>
                    <path d="M9 10.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                  </svg>
                  Category
                </Form.Label>
                <Form.Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="modern-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          {/* Location Search */}
          <Row className="g-4 mt-2">
            <Col md={12}>
              <Form.Group className="search-input-group">
                <Form.Label className="fw-semibold text-neo-primary mb-3 d-flex align-items-center">
                  <svg width="16" height="16" fill="currentColor" className="me-2">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                  Location Search
                </Form.Label>
                <Row className="align-items-end g-3">
                  <Col md={6}>
                    <Button
                      type="button"
                      variant={locationEnabled ? "success" : "outline-primary"}
                      onClick={getCurrentLocation}
                      disabled={locationEnabled || gettingLocation}
                      className="location-btn w-100"
                    >
                      {gettingLocation ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Getting Location...
                        </>
                      ) : locationEnabled ? (
                        <>
                          <svg width="16" height="16" fill="currentColor" className="me-2">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                          </svg>
                          Location Set ✓
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" fill="currentColor" className="me-2">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                          </svg>
                          Get My Location
                        </>
                      )}
                    </Button>
                  </Col>
                  
                  {locationEnabled && (
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        name="radius"
                        placeholder="Radius (km)"
                        value={filters.radius}
                        onChange={handleFilterChange}
                        className="modern-input text-center"
                        min="1"
                        max="100"
                      />
                    </Col>
                  )}
                  
                  <Col md={locationEnabled ? 3 : 6}>
                    <div className="d-flex gap-2">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="search-btn flex-fill"
                        size="lg"
                      >
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        Search
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline-secondary" 
                        onClick={handleReset}
                        className="reset-btn"
                        size="lg"
                      >
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M1.705 8.005a.5.5 0 0 1 .834.656 5.5 5.5 0 0 1-2.911 2.711.5.5 0 1 1-.276-.952A4.498 4.498 0 0 0 1.705 8.005zm.834-.656a.5.5 0 0 1-.834.656A4.498 4.498 0 0 0 1.352 6.295a.5.5 0 1 1 .276-.952 5.5 5.5 0 0 1 2.911 2.711z"/>
                        </svg>
                        Reset
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        
        {/* Search Tips */}
        <div className="mt-4 pt-4" style={{ borderTop: '2px solid var(--surface-dark)' }}>
          <div className="d-flex align-items-start">
            <div className="me-3" style={{ 
              background: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem',
              boxShadow: 'var(--shadow-inset)',
              minWidth: '40px',
              textAlign: 'center'
            }}>
              💡
            </div>
            <div>
              <h6 className="text-neo-primary fw-semibold mb-2">Search Tips</h6>
              <small className="text-neo-muted">
                Use keywords for better results • Enable location for nearby items • Try different combinations of filters • Use specific unique IDs for exact matches
              </small>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SearchFilters;