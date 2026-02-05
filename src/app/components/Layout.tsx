import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, TrendingUp, FileText, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/forecast', icon: TrendingUp, label: 'Forecast & Analytics' },
    { path: '/recommendations', icon: FileText, label: 'Inventory Recommendations' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                SmartChain AI
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Supply Chain Optimization
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 mr-3" />
                ) : (
                  <Moon className="w-5 h-5 mr-3" />
                )}
                <span className="text-sm font-medium">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
