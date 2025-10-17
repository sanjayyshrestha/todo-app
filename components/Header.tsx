'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const TaskMasterLogo: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="text-2xl font-bold text-primary leading-none">
      <span className="inline-block transform -rotate-45">Ξ</span>
    </div>
    <span className="text-2xl font-semibold text-foreground">
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
  ];

  return (
    <header className="w-full border-b border-border bg-background text-foreground transition-colors duration-300">
      <div className="flex justify-between items-center h-16 px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 no-underline hover:opacity-80 transition-opacity">
          <TaskMasterLogo />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors duration-200 no-underline"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme Toggle Button */}
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
