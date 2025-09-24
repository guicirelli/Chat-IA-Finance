import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function Landing() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Controle Financeiro
            </h1>
            <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg mb-8"
          >
            Gerencie suas finanças de forma simples e eficiente
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {!session ? (
              <>
                <Link
                  href="/auth/signin"
                  className="w-full px-8 py-4 bg-indigo-500 text-white text-lg font-medium rounded-xl hover:bg-indigo-600 transform hover:-translate-y-0.5 transition-all duration-150 shadow-lg hover:shadow-indigo-500/25 inline-block"
                >
                  Entrar na Plataforma
                </Link>
                <Link
                  href="/auth/signup"
                  className="w-full px-8 py-4 bg-transparent border-2 border-indigo-500 text-indigo-500 text-lg font-medium rounded-xl hover:bg-indigo-500 hover:text-white transform hover:-translate-y-0.5 transition-all duration-150 inline-block"
                >
                  Criar Conta
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="w-full px-8 py-4 bg-indigo-500 text-white text-lg font-medium rounded-xl hover:bg-indigo-600 transform hover:-translate-y-0.5 transition-all duration-150 shadow-lg hover:shadow-indigo-500/25 inline-block"
              >
                Acessar Dashboard
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
