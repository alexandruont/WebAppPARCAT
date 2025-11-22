'use client';

import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, Camera, CheckCircle, XCircle, FileWarning } from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TicketsPage() {

  const router = useRouter();

  // Lista detectii (simulare API)
  const [detections, setDetections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDetections([
      {
        id: 101,
        nr: "B-123-XYZ",
        zona: "ZONA 1",
        timestamp: "2025-01-14 14:33",
        img: "/car1.jpg",
        status: "nevalidat",
        details: "Vehicul detectat în ZONA 1, OCR a identificat numărul corect."
      },
      {
        id: 102,
        nr: "CJ-88-ABC",
        zona: "ZONA 3",
        timestamp: "2025-01-14 14:35",
        img: "/car2.jpg",
        status: "nevalidat",
        details: "Vehicul detectat fără plată, zona cu risc mare."
      },
      {
        id: 103,
        nr: "IF-09-KLM",
        zona: "ZONA 2",
        timestamp: "2025-01-14 14:37",
        img: "/car3.jpg",
        status: "nevalidat",
        details: "OCR a avut dificultăți, verificare recomandată."
      }
    ]);
  }, []);

  // Navigare detectii
  const nextDetection = () => {
    setCurrentIndex(prev => Math.min(prev + 1, detections.length - 1));
  };

  const prevDetection = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Acțiuni
  const updateStatus = (newStatus) => {
    setDetections(prev =>
      prev.map((d, idx) =>
        idx === currentIndex ? { ...d, status: newStatus } : d
      )
    );
  };

  const markFalse = () => updateStatus("fals");
  const markValid =   () => updateStatus("validat");
  const markContravention = () => updateStatus("contraventie");

  const current = detections[currentIndex];

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
              <Nav.Link href="/tickets" className="fw-bold text-primary">Tickets</Nav.Link>
              <Nav.Link href="/detections">Detectii</Nav.Link>
              <Nav.Link href="/trasee">Trasee</Nav.Link>
            </Nav>
            <Button variant="primary" onClick={() => router.push('/login')}>Sign out</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">

        <h3 className="fw-bold mb-4 text-center">Procesare Detectii</h3>

        {current && (
          <Card className="shadow-sm p-4">

            {/* NAVIGARE STÂNGA / DREAPTA */}
            <Row className="align-items-center mb-4">

              <Col xs={2} className="text-center">
                <Button
                  variant="secondary"
                  onClick={prevDetection}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft size={20} />
                </Button>
              </Col>

              <Col xs={8} className="text-center">
                <img
                  src={current.img}
                  className="border rounded"
                  style={{ width: "100%", maxHeight: 350, objectFit: "cover" }}
                  alt="detectie"
                />
              </Col>

              <Col xs={2} className="text-center">
                <Button
                  variant="secondary"
                  onClick={nextDetection}
                  disabled={currentIndex === detections.length - 1}
                >
                  <ArrowRight size={20} />
                </Button>
              </Col>

            </Row>

            {/* DETALII DETECȚIE */}
            <Card className="p-3 mb-4 shadow-sm">
              <h5 className="fw-bold d-flex align-items-center gap-2">
                <Camera size={18} className="text-primary" />
                {current.nr}
              </h5>

              <p className="m-0">
                <strong>Zonă:</strong> {current.zona} <br />
                <strong>Detectat la:</strong> {current.timestamp} <br />
                <strong>Detalii:</strong> {current.details}
              </p>

              <p className="mt-2">
                <strong>Status: </strong>
                {{
                  nevalidat: <span className="text-warning">Nevalidat</span>,
                  validat: <span className="text-success">Validat</span>,
                  fals: <span className="text-danger">Detecție falsă</span>,
                  contraventie: <span className="text-primary">Contravenție emisă</span>,
                }[current.status]}
              </p>
            </Card>

            {/* BUTOANE */}
            <div className="d-flex gap-3">

              {/* DETECTIE FALSA */}
              <Button
                variant="danger"
                className="d-flex align-items-center gap-2"
                onClick={markFalse}
              >
                <XCircle size={18} />
                Detecție falsă
              </Button>

              {/* VALIDARE DETECTIE */}
              {current.status !== "validat" && current.status !== "contraventie" && (
                <Button
                  variant="success"
                  className="d-flex align-items-center gap-2"
                  onClick={markValid}
                >
                  <CheckCircle size={18} />
                  Validare detecție
                </Button>
              )}

              {/* CONTRAVENTIE EMISA — doar după validare */}
              {current.status === "validat" && (
                <Button
                  variant="primary"
                  className="d-flex align-items-center gap-2"
                  onClick={markContravention}
                >
                  <FileWarning size={18} />
                  Contravenție emisă
                </Button>
              )}

            </div>

          </Card>
        )}

      </Container>
    </div>
  );
}
