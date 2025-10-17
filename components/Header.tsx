'use client';

import React from 'react';
import Link from 'next/link';

const TaskMasterLogo: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="text-2xl font-bold text-green-600 leading-none">
      <span className="inline-block transform -rotate-45">Ξ</span>
    </div>
    <span className="text-2xl font-semibold text-gray-800">
      TaskMaster
    </span>
  </div>
);

type NavItem = {
  name: string;
  href: string;
};

const Header: React.FC = () => {
  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/' },
    { name: 'Add/Edit Task', href: '/add-edit-task' },
    { name: 'Task Analytics', href: '/task-analytics' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="flex justify-between items-center h-16 px-6 py-3">
        <Link href="/" className="flex-shrink-0 text-gray-900 no-underline">
          <TaskMasterLogo />
        </Link>

        <nav>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-gray-700 font-taskSerif text-base hover:text-gray-900 transition-colors duration-200 no-underline"
                >
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
