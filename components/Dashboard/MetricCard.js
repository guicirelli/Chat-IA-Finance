import { motion } from 'framer-motion';
import { useFinanceStore } from '../../store/useFinanceStore';

const MetricCard = ({ title, value, icon, color, change, changeType }) => {
  const { theme } = useFinanceStore();

  const colorClasses = {
    green: {
      bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
      border: theme === 'dark' ? 'border-green-800' : 'border-green-200',
      text: 'text-green-600',
      accent: 'bg-green-500',
    },
    red: {
      bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
      border: theme === 'dark' ? 'border-red-800' : 'border-red-200',
      text: 'text-red-600',
      accent: 'bg-red-500',
    },
    blue: {
      bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
      border: theme === 'dark' ? 'border-blue-800' : 'border-blue-200',
      text: 'text-blue-600',
      accent: 'bg-blue-500',
    },
    purple: {
      bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50',
      border: theme === 'dark' ? 'border-purple-800' : 'border-purple-200',
      text: 'text-purple-600',
      accent: 'bg-purple-500',
    },
    orange: {
      bg: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50',
      border: theme === 'dark' ? 'border-orange-800' : 'border-orange-200',
      text: 'text-orange-600',
      accent: 'bg-orange-500',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(val);
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl p-6 ${colors.bg} ${colors.border} border backdrop-blur-sm`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full rounded-full ${colors.accent}`} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl ${colors.accent} flex items-center justify-center`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div>
              <h3 className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {title}
              </h3>
            </div>
          </div>
          
          {change && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                changeType === 'positive'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <svg
                className={`w-3 h-3 ${
                  changeType === 'positive' ? 'rotate-0' : 'rotate-180'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{change}</span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {formatValue(value)}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
          className={`h-1 rounded-full ${colors.accent} mt-4`}
          style={{ width: '100%' }}
        />
      </div>

      {/* Hover Effect */}
      <motion.div
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        className={`absolute inset-0 ${colors.accent} opacity-0 hover:opacity-5 transition-opacity duration-300`}
      />
    </motion.div>
  );
};

export default MetricCard;
