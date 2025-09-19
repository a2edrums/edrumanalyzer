import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { BsSoundwave } from 'react-icons/bs';

const Layout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-dark text-light">
      <Navbar bg="dark" variant="dark" className="border-bottom border-secondary">
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <BsSoundwave size={24} />
            Electronic Drum Analyzer
          </Navbar.Brand>
        </Container>
      </Navbar>
      
      <Container className="py-4">
        {children}
      </Container>
    </div>
  );
};

export default Layout;