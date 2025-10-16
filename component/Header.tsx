import React from 'react';
import Link from 'next/link';

// Assuming you have an SVG or image for the logo. 
// For this example, I'll use text styling to mimic the look.
const TaskMasterLogo = () => (
  // The text "TaskMaster" with a leading green icon/text
  <div className="flex items-center space-x-1">
    {/* Mimic the green icon - adjust text size and color as needed */}
    <div className="text-2xl font-bold text-green-600 leading-none">
      <span className="inline-block transform -rotate-45">Ξ</span>
    </div>
    {/* The main logo text */}
    <span className="text-2xl font-semibold text-gray-800">
      TaskMaster
    </span>
  </div>
);

const Header = () => {
  // Navigation items to be mapped
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Add/Edit Task', href: '/add-edit-task' },
    { name: 'Task Analytics', href: '/task-analytics' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      
      <div className="flex justify-between items-center h-16 max-w-full mx-auto px-6 py-3">
        
        {/* Left Side: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-gray-900 no-underline">
         
              <TaskMasterLogo />
            
          </Link>
        </div>

        {/* Right Side: Navigation Links */}
        <nav>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-gray-700 font-taskSerif text-base hover:text-gray-900 transition-colors duration-200 no-underline" >
                
                    {item.name}
                  
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;