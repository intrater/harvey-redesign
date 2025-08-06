import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, FileText, Zap, Archive, BookOpen, FileCheck, Settings, HelpCircle } from 'lucide-react';
import { useRecent } from '../contexts/RecentContext';
import { getRelativeTime } from '../utils/time';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recentItems, activeItemId, setActiveItemId } = useRecent();

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

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'Analysis': return '💬';
      case 'Draft': return '✏️';
      case 'Workflow': return '⚡';
      default: return '💬';
    }
  };

  const getItemSubtitle = (type: string, timestamp: Date) => {
    const typeLabel = type === 'Analysis' ? 'Analysis' : type === 'Draft' ? 'Draft' : 'Workflow';
    return `${typeLabel} • ${getRelativeTime(timestamp)}`;
  };

  const handleRecentItemClick = (item: any) => {
    setActiveItemId(item.id);
    navigate(item.route, { state: { query: item.fullQuery, fromRecent: true } });
  };

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-semibold">Harvey</h1>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
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

        <div className="mb-3">
          <h2 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Recent</h2>
        </div>

        <div className="space-y-1 mb-4">
          {recentItems.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400">
              No recent conversations
            </div>
          ) : (
            <>
              {recentItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleRecentItemClick(item)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors border ${
                    activeItemId === item.id
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5 flex-shrink-0">{getItemIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs leading-tight mb-1 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 leading-tight">
                        {getItemSubtitle(item.type, item.timestamp)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {recentItems.length > 0 && (
                <button className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  View all history →
                </button>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
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