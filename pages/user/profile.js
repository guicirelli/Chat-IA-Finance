import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import MainLayout from "../../components/Layout/MainLayout";
import { motion } from "framer-motion";
import { Edit, Save, X, Camera, User, Mail, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        image: session.user.image || ''
      });
    }
  }, [session]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: session?.user?.name || '',
      image: session?.user?.image || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Perfil atualizado com sucesso!');
        setIsEditing(false);
        // Atualizar a sessão
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
            image: formData.image
          }
        });
      } else {
        setError(data.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      setError('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await signOut({ callbackUrl: '/auth/signin' });
    } catch (error) {
      console.error('Erro ao trocar conta:', error);
    }
  };

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <span className="text-white font-bold text-3xl">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie suas informações pessoais</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {success}
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome
              </label>
              {isEditing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white">{session.user.name}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <p className="text-gray-900 dark:text-white">{session.user.email}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                O email não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto de Perfil (URL)
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white">
                    {session.user.image || 'Nenhuma foto definida'}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleEdit}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar Perfil</span>
                  </button>
                  <button
                    onClick={handleSwitchAccount}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Trocar Conta</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}


