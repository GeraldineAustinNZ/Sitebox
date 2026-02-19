import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Truck, MessageSquare, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function DashboardSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/schedule', icon: Truck, label: 'Schedule' },
    { to: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  ];

  return (
    <aside className="w-64 bg-charcoal-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-charcoal-800">
        <h1 className="text-xl font-bold">Sitebox Admin</h1>
      </div>

      <nav className="flex-grow py-6">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-ocean-600 text-white'
                        : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-charcoal-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-charcoal-300 hover:bg-charcoal-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
