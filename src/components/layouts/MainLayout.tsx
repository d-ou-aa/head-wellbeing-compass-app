
import React, { ReactNode } from 'react';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  pageTitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showNav = true,
  pageTitle
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-lightest">
      {pageTitle && (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center">
          <Link to="/" className="mr-4">
            <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
          </Link>
          <h1 className="text-xl font-semibold text-neutral-dark flex-1">{pageTitle}</h1>
        </header>
      )}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {children}
      </main>
      {showNav && <Navigation />}
    </div>
  );
};

export default MainLayout;
