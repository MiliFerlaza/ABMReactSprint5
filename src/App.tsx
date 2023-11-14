import { Suspense } from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import Loader from './components/Loader/Loader.tsx';
import AppRoutes from './routes/AppRoutes.tsx';
import Header from './components/Header/Header.tsx';
import Footer from './components/Footer/Footer.tsx';
import { Container, ToastContainer } from 'react-bootstrap';



function App() {

  return (
    <>
      <ToastContainer />
      <Router>
        <Header />
        <Container style={{ minHeight: '100vh', minWidth: '100%', padding: '0' }}>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </Container>
        <Footer />
      </Router>
    </>
  )

}

export default App
