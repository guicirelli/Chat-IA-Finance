import CollapsibleSidebar from './CollapsibleSidebar';
import Header from './Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <CollapsibleSidebar />
      <Header />
      
      <main className="pt-20 pl-4 pr-4 pb-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}