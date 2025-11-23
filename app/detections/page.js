'use client';

import React, { useState, useEffect } from 'react';
import { Container, Card, Navbar, Nav, Button, Row, Col, Modal } from 'react-bootstrap';
import { MapPin, Search, XCircle, ArrowLeft, ArrowRight, CheckCircle, FileWarning, Clock, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; 
import 'bootstrap/dist/css/bootstrap.min.css';

// ---------------------------
// 1️⃣ COMPONENTA MODAL
// ---------------------------
function DetectionReviewModal({ show, handleClose, initialDetection, allDetections }) {
    const [currentDetection, setCurrentDetection] = useState(initialDetection);
    const [currentIndex, setCurrentIndex] = useState(
        initialDetection ? allDetections.findIndex(d => d.id === initialDetection.id) : -1
    );

    useEffect(() => {
        if (initialDetection) {
            const initialIndex = allDetections.findIndex(d => d.id === initialDetection.id);
            setCurrentIndex(initialIndex);
            setCurrentDetection(allDetections[initialIndex]);
        }
    }, [initialDetection, allDetections]);

    const nextDetection = () => {
        const nextIndex = Math.min(currentIndex + 1, allDetections.length - 1);
        setCurrentIndex(nextIndex);
        setCurrentDetection(allDetections[nextIndex]);
    };

    const prevDetection = () => {
        const prevIndex = Math.max(currentIndex - 1, 0);
        setCurrentIndex(prevIndex);
        setCurrentDetection(allDetections[prevIndex]);
    };

    if (!currentDetection) return null;

    const statusDisplay = {
        nevalidat: <span className="text-warning fw-bold">NEVALIDAT</span>,
        validat: <span className="text-success fw-bold">VALIDAT</span>,
        fals: <span className="text-danger fw-bold">DETECȚIE FALSĂ</span>,
        contraventie: <span className="text-primary fw-bold">CONTRAVENȚIE EMISĂ</span>,
    }[currentDetection.status || "nevalidat"];

    const imageUrl = currentDetection.imageUrl;

    const timestamp = currentDetection.timestamp || Date.now();
    const formattedDate = new Date(timestamp).toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'medium' });
    const zona = currentDetection.zona || "Necunoscută"; 
    const details = currentDetection.details || "Fără detalii suplimentare.";

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="bg-light border-0">
                <Modal.Title className="fw-bold fs-5 text-primary">
                    Revizuire Detecție: {currentDetection.nr}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 bg-light">
                <Card className="shadow-lg border-0">
                    <Card.Body className="p-0">
                        <div className="position-relative">
                            <img
                                src={imageUrl}
                                className="img-fluid rounded-top"
                                style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
                                alt={`Detecția ${currentDetection.nr}`}
                            />
                            <Button
                                variant="light"
                                className="position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle shadow"
                                onClick={prevDetection}
                                disabled={currentIndex === 0}
                            >
                                <ArrowLeft size={20} />
                            </Button>
                            <Button
                                variant="light"
                                className="position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle shadow"
                                onClick={nextDetection}
                                disabled={currentIndex === allDetections.length - 1}
                            >
                                <ArrowRight size={20} />
                            </Button>
                            <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-75 text-white w-100">
                                <span className="fw-semibold">{currentDetection.nr}</span>
                                <span className="float-end">Detecția {currentIndex + 1} din {allDetections.length}</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <Row className="mb-4">
                                <Col md={6}>
                                    <p className="m-0 d-flex align-items-center gap-2">
                                        <Map size={18} className="text-secondary" />
                                        <strong>Locație:</strong> {zona}
                                    </p>
                                    <p className="m-0 d-flex align-items-center gap-2">
                                        <Clock size={18} className="text-secondary" />
                                        <strong>Timp:</strong> {formattedDate}
                                    </p>
                                </Col>
                                <Col md={6} className="text-md-end">
                                    <p className="m-0">
                                        <strong>Detalii OCR:</strong> {details}
                                    </p>
                                    <p className="mt-2 text-lg">
                                        <strong>Status: </strong>
                                        {statusDisplay}
                                    </p>
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
}

// ---------------------------
// 2️⃣ HARTA DINAMIC
// ---------------------------
const LeafletMap = dynamic(() => import('../LeafletMap'), { 
    ssr: false,
    loading: () => <p className="text-center p-5 text-muted">Se încarcă harta...</p>
});

// ---------------------------
// 3️⃣ PAGINA PRINCIPALĂ
// ---------------------------
export default function DetectionsPage() {
    const router = useRouter();
    
    const [detections, setDetections] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDetection, setSelectedDetection] = useState(null);
    const handleCloseModal = () => setSelectedDetection(null);

    // ---------------------------
    // Fetch API local
    // ---------------------------

function transformVehicleData(vehicleData, index = 0) {
    // GPS poate lipsi → fallback
    let lat = 0, lng = 0;
    if (vehicleData.gps && vehicleData.gps.includes(',')) {
        [lat, lng] = vehicleData.gps.split(',').map(Number);
    }

    return {
        id: vehicleData.id || `vehicle-${index}`,
        nr: vehicleData.license_plate || 'Necunoscut',
        lat,
        lng,
        zona: "Necunoscută",
        details: `Detectat la ${vehicleData.datetime || 'necunoscut'}`,
        status: 'nevalidat',
        timestamp: Date.parse(vehicleData.datetime) || Date.now(),
        imageUrl: vehicleData.image
            ? `data:image/jpeg;base64,${vehicleData.image}`
            : "https://placehold.co/600x400?text=NO+IMAGE"
    };
}

    useEffect(() => {
        async function fetchDetections() {
            try {
                const res = await fetch('http://localhost:5000/detections'); // API-ul local
                if (!res.ok) throw new Error('Eroare la fetch API');
                const rawData = await res.json();
                const transformed = rawData.map((v, i) => transformVehicleData(v, i));
                setDetections(transformed);
            } catch (error) {
                console.error('Eroare la preluarea datelor API:', error);
                setDetections([]);
            } finally {
                setLoading(false);
            }
        }

        fetchDetections();
    }, []);

    const handleMarkerClick = (detectionId) => {
        const detection = detections.find(d => d.id === detectionId);
        if (detection) setSelectedDetection(detection);
    };

    // ---------------------------
    // RENDER UI
    // ---------------------------
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
                            <Nav.Link href="/detections" className="fw-bold text-primary">Detecții</Nav.Link>
                            <Nav.Link href="/trasee">Trasee</Nav.Link>
                        </Nav>
                        <Button 
                            variant="primary"
                            onClick={() => router.push('/login')}>
                            Sign out
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="py-4">
                <h2 className="fw-bold mb-4">Detecții în timp real</h2>
                <Row>
                    <Col md={8}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-0">
                                <LeafletMap 
                                    height="600px" 
                                    markers={detections} 
                                    onClickMarker={handleMarkerClick} 
                                /> 
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm border-0" style={{ height: '600px' }}>
                            <Card.Body>
                                <h5 className="fw-semibold d-flex align-items-center gap-2 mb-3 text-primary">
                                    <Search size={20} /> Lista Mașini Fără Tichet ({detections.filter(d => d.status === 'nevalidat').length} nevalidate)
                                </h5>

                                <div style={{ maxHeight: '530px', overflowY: 'auto' }}>
                                    {loading && <p className="text-center text-muted mt-5">Se încarcă lista...</p>}

                                    {!loading && detections.length === 0 && (
                                        <div className="text-center pt-5 text-muted">
                                            <p>Nicio detecție activă în acest moment.</p>
                                        </div>
                                    )}

                                    {!loading && detections.map((d) => (
                                        <div 
                                            key={d.id} 
                                            className={`border-bottom py-2 px-3 d-flex align-items-center gap-2 transition duration-150 ease-in-out ${selectedDetection?.id === d.id ? 'bg-primary-subtle border-primary border-start border-3' : 'hover:bg-light'}`}
                                            onClick={() => setSelectedDetection(d)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className={`rounded-circle p-1 ${d.status === 'nevalidat' ? 'bg-warning' : d.status === 'validat' ? 'bg-success' : 'bg-danger'}`}>
                                                <MapPin size={18} className="text-white flex-shrink-0" />
                                            </div>
                                            <div>
                                                <p className="fw-semibold m-0">{d.nr}</p>
                                                <small className="text-muted">{d.details}</small>
                                            </div>
                                            <XCircle size={18} className="text-muted ms-auto flex-shrink-0" title="Click pentru detalii" />
                                        </div>
                                    ))}
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {selectedDetection && (
                <DetectionReviewModal 
                    initialDetection={selectedDetection}
                    allDetections={detections}
                    show={!!selectedDetection} 
                    handleClose={handleCloseModal}
                />
            )}
        </div>
    );
}
