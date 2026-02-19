import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StickyButton } from './components/StickyButton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { RenovationStoragePage } from './pages/RenovationStoragePage';
import { BuildersPage } from './pages/BuildersPage';
import { ServiceAreasPage } from './pages/ServiceAreasPage';
import { BookingPage } from './pages/BookingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { CustomersPage } from './pages/CustomersPage';
import { BookingsManagementPage } from './pages/BookingsManagementPage';
import { SchedulePage } from './pages/SchedulePage';
import { EnquiriesPage } from './pages/EnquiriesPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { StripeWrapper } from './components/StripeWrapper';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/renovation-storage-wanaka" element={<RenovationStoragePage />} />
              <Route path="/site-storage-wanaka" element={<BuildersPage />} />
              <Route path="/service-areas" element={<ServiceAreasPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route
                path="/checkout"
                element={
                  <ErrorBoundary
                    fallbackTitle="Payment System Error"
                    fallbackMessage="We encountered an error while loading the payment form. This could be due to a configuration issue or network problem."
                  >
                    <StripeWrapper>
                      <CheckoutPage />
                    </StripeWrapper>
                  </ErrorBoundary>
                }
              />
              <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><DashboardOverviewPage /></ProtectedRoute>} />
              <Route path="/admin/bookings" element={<ProtectedRoute><BookingsManagementPage /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
              <Route path="/admin/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
              <Route path="/admin/enquiries" element={<ProtectedRoute><EnquiriesPage /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
          <StickyButton />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
