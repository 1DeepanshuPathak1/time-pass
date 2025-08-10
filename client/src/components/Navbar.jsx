import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './css/Navbar.css'; 

const Navbar = () => {
  return (
    <BootstrapNavbar expand="lg" sticky="top" className="navbar">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand className="navbar-brand">
            <div className="brand-icon">🔍</div>
            <span className="brand-text">Lost & Found</span>
          </BootstrapNavbar.Brand>
        </LinkContainer>
        
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="navbar-toggler"
        />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-nav">
            <LinkContainer to="/">
              <Nav.Link className="nav-link">
                <svg width="18" height="18" fill="currentColor" className="nav-icon">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>
                </svg>
                <span className="nav-text">Home</span>
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/report">
              <Nav.Link className="nav-link">
                <svg width="18" height="18" fill="currentColor" className="nav-icon">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                <span className="nav-text">Report Item</span>
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/scan">
              <Nav.Link className="nav-link">
                <svg width="18" height="18" fill="currentColor" className="nav-icon">
                  <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h2A1.5 1.5 0 0 1 5 1.5v2A1.5 1.5 0 0 1 3.5 5h-2A1.5 1.5 0 0 1 0 3.5v-2zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2z"/>
                  <path d="M11 1.5v2A1.5 1.5 0 0 1 9.5 5h-2A1.5 1.5 0 0 1 6 3.5v-2A1.5 1.5 0 0 1 7.5 0h2A1.5 1.5 0 0 1 11 1.5zM9.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2z"/>
                  <path d="M0 11.5A1.5 1.5 0 0 1 1.5 10h2A1.5 1.5 0 0 1 5 11.5v2A1.5 1.5 0 0 1 3.5 15h-2A1.5 1.5 0 0 1 0 13.5v-2zm1.5-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2z"/>
                  <path d="M11 11.5v2a1.5 1.5 0 0 1-1.5 1.5h-2a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 7.5 10h2a1.5 1.5 0 0 1 1.5 1.5z"/>
                </svg>
                <span className="nav-text">QR Scanner</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;