import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/ItemCard.css'; 

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'lost':
        return 'danger';
      case 'found':
        return 'success';
      case 'claimed':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'lost':
        return '❌';
      case 'found':
        return '✅';
      case 'claimed':
        return '🎉';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Accessories': '👓',
      'Documents': '📄',
      'Keys': '🔑',
      'Bags': '👜',
      'Books': '📚',
      'Sports': '⚽',
      'Jewelry': '💎',
      'Other': '📦'
    };
    return categoryIcons[category] || '📦';
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const itemDate = new Date(dateString);
    const diffInHours = Math.floor((now - itemDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="item-card h-100 position-relative">
      <Badge 
        bg={getStatusColor(item.status)} 
        className="status-badge"
      >
        {getStatusIcon(item.status)} {item.status.toUpperCase()}
      </Badge>
      
      {item.image_path ? (
        <Card.Img 
          variant="top" 
          src={`/uploads/${item.image_path}`}
          className="item-image"
          alt={item.name}
        />
      ) : (
        <div 
          className="item-image d-flex align-items-center justify-content-center"
          style={{ 
            background: 'var(--surface-base)',
            boxShadow: 'var(--shadow-inset)',
            fontSize: '3rem',
            opacity: '0.5',
            height: '200px'
          }}
        >
          {getCategoryIcon(item.category)}
        </div>
      )}
      
      <Card.Body className="d-flex flex-column p-4">
        <div className="mb-3">
          <Card.Title className="h5 mb-2 text-neo-primary fw-bold">
            {item.name}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-neo-muted fw-semibold d-flex align-items-center">
            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3z"/>
              <path d="M9 2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3z"/>
              <path d="M1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3z"/>
              <path d="M9 10.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
            </svg>
            {item.category}
          </Card.Subtitle>
        </div>
        
        <Card.Text className="flex-grow-1 text-neo-secondary mb-3">
          {item.description?.substring(0, 100)}
          {item.description?.length > 100 && '...'}
        </Card.Text>
        
        <div className="mt-auto pt-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <small className="text-neo-muted d-flex align-items-center">
              <svg width="14" height="14" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
              </svg>
              {getTimeAgo(item.created_at)}
            </small>
            
            {/* Location indicator */}
            {item.lat && item.lon && (
              <small className="text-neo-muted d-flex align-items-center">
                <svg width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                Located
              </small>
            )}
          </div>
          
          {/* Unique ID Display */}
          <div className="mb-3">
            <small className="text-neo-muted d-flex align-items-center">
              <svg width="14" height="14" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4zm0 1h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3z"/>
              </svg>
              ID: <code className="ms-1 text-neo-secondary" style={{ 
                fontSize: '0.75rem',
                background: 'var(--surface-dark)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {item.unique_id.substring(0, 8)}...
              </code>
            </small>
          </div>
          
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => navigate(`/item/${item.id}`)}
            className="w-100 fw-semibold neo-button"
            style={{
              background: 'var(--gradient-card)',
              border: '2px solid var(--accent-blue)',
              color: 'var(--accent-blue)',
              borderRadius: 'var(--radius-round)'
            }}
          >
            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
            </svg>
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;