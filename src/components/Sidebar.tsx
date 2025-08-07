import { NavLink, useNavigate } from 'react-router-dom';
import { 
  House, 
  FileText,
  Lightning,
  Archive, 
  BookOpen, 
  CheckSquare, 
  Gear, 
  Question, 
  X,
  User,
  MagnifyingGlass
} from 'phosphor-react';
import { useRecent } from '../contexts/RecentContext';
import { useCommandPalette } from '../contexts/CommandPaletteContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { recentItems, activeItemId, setActiveItemId, removeRecentItem } = useRecent();
  const { openCommandPalette } = useCommandPalette();

  const navItems = [
    { icon: House, label: 'Home', path: '/' },
    { icon: FileText, label: 'Draft', path: '/draft' },
    { icon: Lightning, label: 'Automate', path: '/automate' },
    { icon: Archive, label: 'Vault', path: '/vault' },
    { icon: BookOpen, label: 'Library', path: '/library' },
    { icon: CheckSquare, label: 'Guidance', path: '/guidance' },
  ];


  const utilityItems = [
    { icon: Gear, label: 'Settings', path: '/settings' },
    { icon: Question, label: 'Help', path: '/help' },
  ];

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-gray-900 bg-gray-100'
        : 'text-gray-700 hover:bg-gray-100'
    }`;




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
              {({ isActive }) => (
                <>
                  <item.icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </>
              )}
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

      </nav>

      <div className="mt-auto p-3">
        <div className="my-4 border-t border-gray-200"></div>
        {/* Ask and Search CTAs */}
        <div className="mb-3 flex gap-2">
          <button
            onClick={openCommandPalette}
            className="flex-1 flex items-center justify-between px-3 py-2.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-medium"
          >
            <span>Ask</span>
            <div className="flex items-center gap-0.5 text-xs text-gray-500">
              <span className="px-1.5 py-0.5 border border-gray-400 rounded text-xs">⌘</span>
              <span className="text-gray-400">+</span>
              <span className="px-1.5 py-0.5 border border-gray-400 rounded text-xs">K</span>
            </div>
          </button>
          
          <button
            onClick={() => {
              console.log('Search clicked');
            }}
            className="px-3 py-2.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            title="Search"
          >
            <MagnifyingGlass size={16} weight="regular" />
          </button>
        </div>

        <div className="space-y-1">
          {utilityItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClasses}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;