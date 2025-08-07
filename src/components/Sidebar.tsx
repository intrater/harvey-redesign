import { NavLink, useNavigate } from 'react-router-dom';
import { 
  House, 
  ChatCircle,
  FileText,
  Lightning,
  Archive, 
  BookOpen, 
  CheckSquare, 
  Gear, 
  Question, 
  X 
} from 'phosphor-react';
import { useRecent } from '../contexts/RecentContext';
import { getRelativeTime } from '../utils/time';

const Sidebar = () => {
  const navigate = useNavigate();
  const { recentItems, activeItemId, setActiveItemId, removeRecentItem } = useRecent();

  const navItems = [
    { icon: House, label: 'Home', path: '/' },
    { icon: ChatCircle, label: 'Assistant', path: '/ask' },
    { icon: FileText, label: 'Draft', path: '/draft' },
    { icon: Lightning, label: 'Automate', path: '/automate' },
  ];

  const bottomItems = [
    { icon: Archive, label: 'Vault', path: '/vault' },
    { icon: BookOpen, label: 'Library', path: '/library' },
    { icon: CheckSquare, label: 'Guidance', path: '/guidance' },
  ];

  const utilityItems = [
    { icon: Gear, label: 'Settings', path: '/settings' },
    { icon: Question, label: 'Help', path: '/help' },
  ];

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-black text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Analysis': return ChatCircle;
      case 'Draft': return FileText;
      case 'Workflow': return Lightning;
      default: return ChatCircle;
    }
  };



  const handleRecentItemClick = (item: any) => {
    setActiveItemId(item.id);
    navigate(item.route, { state: { query: item.fullQuery, fromRecent: true } });
  };

  const handleRemoveItem = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation(); // Prevent triggering the item click
    removeRecentItem(itemId);
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
              <item.icon size={20} weight="regular" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="my-4 border-t border-gray-200"></div>

        <div className="mb-1">
          <h2 className="px-3 text-xs font-medium text-gray-600">Recents</h2>
        </div>

        <div className="space-y-0.5 mb-2">
          {recentItems.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-500">
              No recent conversations
            </div>
          ) : (
            <>
              {recentItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleRecentItemClick(item)}
                  className={`w-full text-left px-3 py-1 rounded-md text-sm transition-colors group ${
                    activeItemId === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-0">
                    <div className="flex items-center">
                      <div className="text-sm font-medium leading-tight truncate pr-1" style={{maxWidth: 'calc(100% - 24px)'}}>
                        {item.title}
                      </div>
                      <button
                        onClick={(e) => handleRemoveItem(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all ml-auto flex-shrink-0"
                        title="Remove from recent"
                      >
                        <X size={14} weight="bold" className="text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      {(() => {
                        const IconComponent = getTypeIcon(item.type);
                        return <IconComponent size={12} weight="fill" className="text-gray-400" />;
                      })()}
                      <span>{getRelativeTime(item.timestamp)}</span>
                    </div>
                  </div>
                </button>
              ))}
              {recentItems.length > 0 && (
                <div className="px-3 py-1.5">
                  <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    View all →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 pt-2">
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClasses}
              >
                <item.icon size={20} weight="regular" />
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
              <item.icon size={20} weight="regular" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;