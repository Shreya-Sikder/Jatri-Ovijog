import React, { useState } from 'react';
import { Menu, Bell, User, X, LogIn } from 'lucide-react';
import { signOut } from '../lib/auth';
import { useNavigate } from '../hooks/useNavigate';
import { getCurrentUser } from '../lib/auth';

export function Header({ userType = 'passenger' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = userType === 'police' ? [
    { href: '/police-dashboard', label: 'Dashboard' },
    { href: '/complaints', label: 'View Complaints' },
    { href: '/emergency', label: 'Emergency Cases' },
  ] : [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/bus-companies', label: 'Bus Companies'},
    { href: '/feed', label: 'Community Feed' },
    { href: '/report', label: 'Report Issue' },
    { href: '/emergency', label: 'Emergency' },
  ];

  return (
    <header className="bg-indigo-600 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-indigo-500 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="ml-4 flex items-center">
              <Bell className="h-6 w-6" />
              <span className="ml-2 text-xl font-bold">Jatri_Ovijog</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex space-x-8">
            {menuItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="hover:bg-indigo-500 px-3 py-2 rounded-md"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="p-2 rounded-md hover:bg-indigo-500"
                >
                  <User className="h-6 w-6" />
                </button>

                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/"
                className="flex items-center space-x-1 hover:bg-indigo-500 px-3 py-2 rounded-md"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-600">
            {menuItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-white hover:bg-indigo-500"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}