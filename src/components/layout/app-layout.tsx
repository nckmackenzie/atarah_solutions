import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/user-nav';

export default function AppLayout() {
  return (
    <>
      <Sidebar />
      <main className="h-screen bg-background md:pl-72">
        <Navbar />
        <div className="h-[calc(100%-3.5rem)]">
          <Outlet />
        </div>
      </main>
    </>
  );
}
