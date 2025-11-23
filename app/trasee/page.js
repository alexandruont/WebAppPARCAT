'use client';

import React from 'react';
import { Container, Navbar, Nav, Button, Card } from 'react-bootstrap';
import { Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../LeafletMap'), {
  ssr: false
});

export default function TraseePage() {

  const router = useRouter();

  return (
    <div className="bg-light min-vh-100">

      {/* NAVBAR */}
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
        <Container>
          <Navbar.Brand className="fw-bold">PARCAT</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/tickets">Tickets</Nav.Link>
              <Nav.Link href="/detections">Detectii</Nav.Link>
              <Nav.Link href="/trasee" className="fw-bold text-primary">Trasee</Nav.Link>
            </Nav>
            <Button variant="primary" onClick={() => router.push('/login')}>
              Sign Out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">

        <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <Map size={22} className="text-primary" />
          Vizualizare Trasee
        </h3>

        {/* HARTA */}
        <Card className="shadow-sm">
          <Card.Body className="p-0" style={{ height: "600px" }}>
            <LeafletMap height="600px" />
          </Card.Body>
        </Card>

      </Container>
    </div>
  );
}
