import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value !== '')
    );
    onSearch(cleanFilters);
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
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <div className="search-title-section">
          <h4 className="search-title">🔍 Find Items</h4>
          <p className="search-subtitle">Use filters to find exactly what you're looking for</p>
        </div>
        <Button
          variant="link"
          className="expand-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲ Less Filters' : '▼ More Filters'}
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="search-form">
        <div className="primary-search">
          <div className="search-input-wrapper">
            <input
              type="text"
              name="keyword"
              placeholder="Search by name or description..."
              value={filters.keyword}
              onChange={handleFilterChange}
              className="main-search-input"
            />
            <Button type="submit" className="search-btn">
              <svg width="18" height="18" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </Button>
          </div>
          <Button
            type="button"
            variant="outline-secondary"
            className="reset-btn"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>

        {isExpanded && (
          <div className="expanded-filters">
            <div className="filter-group">
              <div className="filter-item">
                <label className="filter-label">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Status</option>
                  <option value="lost">❌ Lost</option>
                  <option value="found">✅ Found</option>
                  <option value="claimed">🎉 Claimed</option>
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Unique ID</label>
                <input
                  type="text"
                  name="unique_id"
                  placeholder="Enter ID..."
                  value={filters.unique_id}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="location-section">
              <div className="location-header">
                <span className="location-title">📍 Location Search</span>
                <Button
                  type="button"
                  variant={locationEnabled ? "success" : "outline-primary"}
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={locationEnabled || gettingLocation}
                  className="location-btn"
                >
                  {gettingLocation ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-1"></div>
                      Getting...
                    </>
                  ) : locationEnabled ? (
                    <>✓ Located</>
                  ) : (
                    <>Get Location</>
                  )}
                </Button>
              </div>

              {locationEnabled && (
                <div className="radius-control">
                  <label className="filter-label">Search Radius (km)</label>
                  <input
                    type="number"
                    name="radius"
                    placeholder="5"
                    value={filters.radius}
                    onChange={handleFilterChange}
                    className="radius-input"
                    min="1"
                    max="100"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default SearchFilters;