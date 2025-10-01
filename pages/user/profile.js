import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import MainLayout from "../../components/Layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Save, X, Camera, User, Mail, ArrowLeft, Calendar, CheckCircle, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: ''
  });

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.unsafeMetadata?.firstName || user.firstName || '',
        lastName: user.unsafeMetadata?.lastName || user.lastName || '',
        birthDate: user.unsafeMetadata?.birthDate || ''
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploadingImage(true);
    try {
      await user.setProfileImage({ file });
      await user.reload();
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      alert('Erro ao atualizar imagem. Tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm('Deseja realmente remover sua foto de perfil?')) {
      return;
    }

    setUploadingImage(true);
    try {
      await user.setProfileImage({ file: null });
      await user.reload();
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      alert('Erro ao remover imagem. Tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('💾 Salvando dados:', formData);
      
      // Salvar tudo no unsafeMetadata porque firstName e lastName 
      // não podem ser editados via user.update() em algumas configurações do Clerk
      await user.update({
        unsafeMetadata: {
          firstName: formData.firstName?.trim() || null,
          lastName: formData.lastName?.trim() || null,
          birthDate: formData.birthDate || null
        }
      });
      
      console.log('✅ Perfil atualizado com sucesso!');
      
      // Aguardar um pouco para garantir que os dados foram salvos
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recarregar dados do usuário
      await user.reload();
      
      setIsEditing(false);
      setShowSuccess(true);
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        errors: error.errors,
        status: error.status
      });
      
      let errorMessage = 'Erro ao salvar perfil. ';
      
      if (error.errors && error.errors.length > 0) {
        errorMessage += error.errors.map(e => e.message).join(', ');
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Tente novamente.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Redirecionando...
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Perfil do Usuário</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Gerencie suas informações pessoais
              </p>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          </div>

          {/* Mensagem de Sucesso */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center space-x-3"
              >
                <div className="bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Perfil atualizado com sucesso!
                  </p>
                  <p className="text-green-600 dark:text-green-300 text-sm">
                    Suas informações foram salvas.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Informações do Usuário */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  {user.imageUrl || user.profileImageUrl ? (
                    <img 
                      src={user.imageUrl || user.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {user.username ? user.username.charAt(0).toUpperCase() : (user.firstName ? user.firstName.charAt(0).toUpperCase() : user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase())}
                    </span>
                  )}
                </div>
                
                {/* Botões de ação da imagem - apenas no modo de edição */}
                {isEditing && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                    {/* Botão de adicionar/editar imagem */}
                    <label 
                      htmlFor="profile-image-upload"
                      className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-lg group-hover:scale-110 transform duration-200"
                      title="Alterar foto"
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    
                    {/* Botão de remover imagem - apenas se houver imagem */}
                    {(user.imageUrl || user.profileImageUrl) && (
                      <button
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                        className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all shadow-lg group-hover:scale-110 transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1 space-y-6">
                {/* Username e Email - Não editáveis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Username
                    </label>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-900 dark:text-white font-medium capitalize">
                        {user.username || 'Não definido'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-900 dark:text-white font-medium text-sm">
                        {user.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nome e Sobrenome - Editáveis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nome
                    </label>
                    {isEditing ? (
                      <motion.input
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="Seu nome"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 hover:border-blue-400"
                      />
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-900 dark:text-white font-medium">
                          {user.unsafeMetadata?.firstName || user.firstName || 'Não informado'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Sobrenome
                    </label>
                    {isEditing ? (
                      <motion.input
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Seu sobrenome"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 hover:border-blue-400"
                      />
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-900 dark:text-white font-medium">
                          {user.unsafeMetadata?.lastName || user.lastName || 'Não informado'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data de Nascimento
                  </label>
                  {isEditing ? (
                    <motion.div 
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      className="relative group"
                    >
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 hover:border-blue-400 cursor-pointer"
                        style={{
                          colorScheme: 'light dark'
                        }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none group-hover:scale-110 transition-transform" />
                    </motion.div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg px-4 py-3 border border-blue-200 dark:border-blue-800 flex items-center space-x-3">
                      <div className="bg-blue-500 rounded-full p-1.5">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-slate-900 dark:text-white font-medium">
                        {formData.birthDate ? new Date(formData.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        }) : 'Não informado'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Salvar</span>
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informações da Conta
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Criado em</p>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Última atualização</p>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Segurança
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-green-500">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Email verificado</p>
                    <p className="text-green-600 dark:text-green-400 font-medium">Verificado</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-blue-500">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Autenticação</p>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Clerk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}