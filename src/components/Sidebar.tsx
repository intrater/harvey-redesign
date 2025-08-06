import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, FileText, Zap, Archive, BookOpen, FileCheck, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Ask', path: '/ask' },
    { icon: FileText, label: 'Draft', path: '/draft' },
    { icon: Zap, label: 'Automate', path: '/automate' },
  ];

  const bottomItems = [
    { icon: Archive, label: 'Vault', path: '/vault' },
    { icon: BookOpen, label: 'Library', path: '/library' },
    { icon: FileCheck, label: 'Guidance', path: '/guidance' },
  ];

  const utilityItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
      isActive
        ? 'bg-black text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-semibold">Harvey</h1>
      </div>

      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClasses}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="my-4 border-t border-gray-200"></div>

        <div className="mb-2">
          <h2 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Recent</h2>
        </div>

        <div className="my-4 border-t border-gray-200"></div>

        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClasses}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-auto p-3 border-t border-gray-200">
        <div className="space-y-1">
          {utilityItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClasses}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;