import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* 1. The Navbar stays fixed at the top */}
      <Navbar />
      
      {/* 2. The <Outlet /> renders the child route (Dashboard, CreateSurvey, etc.) */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}