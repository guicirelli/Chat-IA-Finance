import { motion } from 'framer-motion';
import Header from './Header';

export default function MainLayout({ 
  children,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  isEditMode,
  setIsEditMode,
  isEditing,
  setIsEditing,
  handleSave,
  openModal
}) {
  const showDashboardControls = selectedMonth !== undefined;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Efeitos de fundo difusos - igual à página inicial */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        
        {/* Blobs adicionais nos cantos */}
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000"></div>
      </div>
      
      <Header 
        showDashboardControls={showDashboardControls}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        openModal={openModal}
      />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`${showDashboardControls ? 'pt-28 sm:pt-24' : 'pt-20'} px-3 sm:px-4 pb-6 sm:pb-8 transition-all duration-300 relative z-10`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}