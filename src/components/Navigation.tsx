
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, BarChart2, BookOpen, Menu } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Chat History', path: '/chat-history', icon: MessageSquare },
    { name: 'Journal', path: '/journal', icon: BarChart2 },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];
  
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-gray-200 dark:border-gray-800 z-10">
        <div className="flex justify-between items-center h-16 px-8 max-w-md mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                location.pathname === item.path
                  ? 'text-teal'
                  : 'text-gray-500 hover:text-teal-dark'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
          
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-teal-dark transition-colors"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>
      
      {/* More menu overlay */}
      {showMore && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-16 right-0 left-0 bg-white dark:bg-card shadow-lg rounded-t-2xl p-4 z-30 max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <Link to="/profile" className="flex flex-col items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMore(false)}>
                <div className="w-10 h-10 bg-teal/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-teal">👤</span>
                </div>
                <span className="text-sm">Profile</span>
              </Link>
              <Link to="/settings" className="flex flex-col items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMore(false)}>
                <div className="w-10 h-10 bg-teal/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-teal">⚙️</span>
                </div>
                <span className="text-sm">Settings</span>
              </Link>
              <Link to="/crisis" className="flex flex-col items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMore(false)}>
                <div className="w-10 h-10 bg-emergency/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-emergency">🆘</span>
                </div>
                <span className="text-sm">Crisis</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;
