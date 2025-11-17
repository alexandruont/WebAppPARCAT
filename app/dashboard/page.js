'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { Bell, RefreshCw, AlertTriangle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

export default function Dashboard() {

  const router = useRouter();

  const [traseuActive, setTraseuActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const simulatedAlerts = [
      { id: 1, type: "success", msg: "Un traseu a început la 14:32" },
      { id: 2, type: "warning", msg: "Camera 2 este înclinată, ajustați poziția" },
      { id: 3, type: "danger", msg: "OCR a detectat 3 erori consecutive" }
    ];
    setAlerts(simulatedAlerts);
    setTraseuActive(true);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
        <Container>
          <Navbar.Brand className="fw-bold">PARCAT</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/tickets">Tickets</Nav.Link>
              <Nav.Link href="/detections">Detectii</Nav.Link>
              <Nav.Link href="/trasee">Trasee</Nav.Link>
            </Nav>
            <Button 
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={() => router.push('/login')}>
              Sign out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Dashboard</h2>
          <Button 
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={handleRefresh}
            disabled={loading}
            >
            <RefreshCw className={loading ? "spin" : ""} size={18} />
            Refresh
          </Button>
        </div>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <p className="text-muted">Status traseu</p>
                <h3>
                  {traseuActive ? (
                    <Badge bg="success">În desfășurare</Badge>
                  ) : (
                    <Badge bg="secondary">Oprit</Badge>
                  )}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <p className="text-muted">Detectări noi</p>
                <h3 className="fw-bold text-primary">23</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <p className="text-muted">Vehicule fără plată</p>
                <h3 className="fw-bold text-danger">5</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h5 className="fw-semibold mb-3">Alerte active</h5>

        {alerts.map(alert => (
          <Card key={alert.id} className="mb-3 shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <AlertTriangle 
                size={22} 
                className={`me-3 text-${alert.type}`} 
              />
              <span className={`fw-semibold text-${alert.type}`}>
                {alert.msg}
              </span>
            </Card.Body>
          </Card>
        ))}

      </Container>
    </div>
  );
}
