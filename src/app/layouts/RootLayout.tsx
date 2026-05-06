import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}
