import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Image } from 'react-bootstrap';
import { itemsAPI } from '../services/api';
import './css/ReportItem.css';
import './css/SharedComponents.css';

const ReportItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'lost',
    unique_id: '',
    image: null
  });
  
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    locationObtained: false
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdItem, setCreatedItem] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    loadCategories();
    getCurrentLocation();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await itemsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            locationObtained: true
          });
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. You can still submit without location data.');
          setGettingLocation(false);
        }
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      submitData.append('unique_id', formData.unique_id);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      if (location.lat && location.lon) {
        submitData.append('lat', location.lat);
        submitData.append('lon', location.lon);
      }
      
      const response = await itemsAPI.createItem(submitData);
      
      setSuccess('Item reported successfully!');
      setCreatedItem(response.data.item);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        status: 'lost',
        unique_id: '',
        image: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error creating item:', error);
      setError(error.response?.data?.error || 'Failed to report item. Please try again.');
    } finally {
      setLoading(false);
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
                <div className="mb-3" style={{ fontSize: '4rem' }}>📝</div>
                <h2 className="text-neo-primary fw-bold mb-3">Report Lost or Found Item</h2>
                <p className="text-neo-muted">
                  Help reunite items with their owners by providing detailed information
                </p>
              </div>
              
              {/* Alerts */}
              {error && (
                <Alert variant="danger" className="neo-surface mb-4" dismissible onClose={() => setError('')}>
                  <div className="d-flex align-items-center">
                    <svg width="20" height="20" fill="currentColor" className="me-3 flex-shrink-0">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    {error}
                  </div>
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="neo-surface mb-4" dismissible onClose={() => setSuccess('')}>
                  <div className="d-flex align-items-center">
                    <svg width="20" height="20" fill="currentColor" className="me-3 flex-shrink-0">
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                    {success}
                  </div>
                </Alert>
              )}
              
              {/* Success Card with QR Code */}
              {createdItem && (
                <div 
                  className="mb-4 p-4"
                  style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-inset)',
                    border: '2px solid var(--accent-green)'
                  }}
                >
                  <div className="text-center">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🎉</div>
                    <h5 className="text-success fw-bold mb-3">Item Created Successfully!</h5>
                    <div className="mb-3">
                      <strong className="text-neo-primary">Unique ID:</strong>{' '}
                      <code 
                        className="px-2 py-1 ms-2"
                        style={{
                          background: 'var(--surface)',
                          borderRadius: 'var(--radius-sm)',
                          boxShadow: 'var(--shadow-inset)'
                        }}
                      >
                        {createdItem.unique_id}
                      </code>
                    </div>
                    <p className="text-neo-muted mb-4">Save this ID to reference your item later.</p>
                    
                    {createdItem.qr_code_path && (
                      <div className="qr-code-display">
                        <h6 className="text-neo-primary fw-semibold mb-3">QR Code Generated:</h6>
                        <Image 
                          src={`/qrcodes/${createdItem.qr_code_path}`}
                          alt="QR Code"
                          style={{ maxWidth: '200px' }}
                          className="d-block mx-auto"
                        />
                        <p className="mt-3 small text-neo-muted">
                          Share this QR code to help others identify your item
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Form */}
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  {/* Item Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                        </svg>
                        Item Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., iPhone 13, Blue Wallet, etc."
                        className="modern-input"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  {/* Category */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3z"/>
                        </svg>
                        Category *
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="modern-select"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="g-4 mt-1">
                  {/* Status */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        </svg>
                        Status *
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="modern-select"
                        required
                      >
                        <option value="lost">❌ Lost</option>
                        <option value="found">✅ Found</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  {/* Unique ID */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4z"/>
                        </svg>
                        Unique ID (Optional)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="unique_id"
                        value={formData.unique_id}
                        onChange={handleInputChange}
                        placeholder="Serial number, custom ID, etc."
                        className="modern-input"
                      />
                      <Form.Text className="text-neo-muted">
                        Leave empty to auto-generate a unique ID
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Description */}
                <Row className="g-4 mt-1">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M5 0a.5.5 0 0 1 .5.5V2h4V.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 13.5 3.5v9A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 2h1.5V.5z"/>
                        </svg>
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Provide additional details about the item..."
                        className="modern-input"
                        style={{ resize: 'vertical', minHeight: '120px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Photo Upload */}
                <Row className="g-4 mt-1">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-neo-primary mb-2 d-flex align-items-center">
                        <svg width="16" height="16" fill="currentColor" className="me-2">
                          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                        </svg>
                        Photo (Optional)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="modern-input"
                      />
                      <Form.Text className="text-neo-muted">
                        Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Location Status */}
                <Row className="g-4 mt-2">
                  <Col md={12}>
                    <div 
                      className="p-3 d-flex align-items-center"
                      style={{
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-inset)'
                      }}
                    >
                      <svg width="20" height="20" fill="currentColor" className="me-3 flex-shrink-0">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                      </svg>
                      <div className="flex-grow-1">
                        <strong className="text-neo-primary">Location Status: </strong>
                        {gettingLocation ? (
                          <span className="text-warning">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Getting location...
                          </span>
                        ) : location.locationObtained ? (
                          <span className="text-success fw-semibold">
                            ✅ Location obtained ({location.lat.toFixed(6)}, {location.lon.toFixed(6)})
                          </span>
                        ) : (
                          <span className="text-muted">
                            ❌ Location not available (you can still submit)
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
                
                {/* Submit Button */}
                <Row className="mt-5">
                  <Col md={12}>
                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        disabled={loading}
                        className="py-3 fw-semibold"
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Reporting Item...
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" fill="currentColor" className="me-2">
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg>
                            Report Item
                          </>
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportItem;