import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Plus, 
  Sparkles, 
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  Armchair
} from 'lucide-react';
import { Button } from './components/Button';
import { Input, TextArea } from './components/Input';
import { generateDescription } from './services/geminiService';

// --- Types ---
type ViewState = 'login' | 'register' | 'dashboard';

interface RegisteredItem {
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
}

// --- Main Component ---
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [items, setItems] = useState<RegisteredItem[]>([]);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // New Item Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemKeywords, setNewItemKeywords] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Initialize with some mock data
  useEffect(() => {
    setItems([
      { id: '1', name: 'Guarda-Roupa Casal', category: 'Quarto', description: 'Guarda-roupa espaçoso com 6 portas e espelho central, ideal para organizar roupas e acessórios com elegância.', createdAt: new Date().toLocaleDateString() },
      { id: '2', name: 'Sofá Retrátil 3 Lugares', category: 'Sala de Estar', description: 'Sofá extremamente confortável com tecido suede aveludado, assentos retráteis e encosto reclinável para máximo relaxamento.', createdAt: new Date().toLocaleDateString() },
    ]);
  }, []);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    // Simulate API delay
    setTimeout(() => {
      if (email && password.length >= 6) {
        setView('dashboard');
      } else {
        setAuthError('Credenciais inválidas. Senha deve ter no mínimo 6 caracteres.');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    setTimeout(() => {
      if (email && password.length >= 6 && name) {
        setView('dashboard');
      } else {
        setAuthError('Preencha todos os campos corretamente.');
      }
      setLoading(false);
    }, 1000);
  };

  const handleGenerateDescription = async () => {
    if (!newItemName || !newItemCategory) return;
    
    setIsGeneratingAI(true);
    const desc = await generateDescription(newItemName, newItemCategory, newItemKeywords);
    setNewItemDescription(desc);
    setIsGeneratingAI(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: RegisteredItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      category: newItemCategory,
      description: newItemDescription,
      createdAt: new Date().toLocaleDateString()
    };
    setItems([newItem, ...items]);
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemCategory('');
    setNewItemKeywords('');
    setNewItemDescription('');
  };

  const handleLogout = () => {
    setView('login');
    setEmail('');
    setPassword('');
    setName('');
  };

  // --- Render Functions ---

  const renderAuth = () => (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Auth Container */}
        <div className="w-full p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 mb-4 text-brand-600 shadow-sm border border-brand-100">
              <Armchair size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">SS MÓVEIS</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-px w-8 bg-brand-200"></span>
              <p className="font-semibold text-brand-600 tracking-widest text-sm">BACABAL - MA</p>
              <span className="h-px w-8 bg-brand-200"></span>
            </div>
            <p className="text-gray-500 mt-4 text-sm">
              {view === 'login' ? 'Bem-vindo! Acesse o sistema.' : 'Crie sua conta para começar.'}
            </p>
          </div>

          <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-5">
            {view === 'register' && (
              <Input 
                icon={<User size={18} />}
                type="text" 
                placeholder="Nome Completo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            
            <Input 
              icon={<Mail size={18} />}
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              icon={<Lock size={18} />}
              type="password" 
              placeholder="Sua senha secreta" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {authError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center animate-in slide-in-from-top-2">
                <XCircle size={16} className="mr-2 flex-shrink-0" />
                {authError}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-brand-200 hover:shadow-brand-300 transform transition-all active:scale-[0.98]" isLoading={loading}>
              {view === 'login' ? 'Entrar no Sistema' : 'Criar Conta Grátis'}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {view === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button onClick={() => setView('register')} className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                  Cadastre-se aqui
                </button>
              </>
            ) : (
              <>
                Já possui conta?{' '}
                <button onClick={() => setView('login')} className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                  Faça Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-brand-200">
              <Armchair size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-gray-900 tracking-tight leading-none">SS MÓVEIS</span>
              <span className="text-[10px] font-bold text-brand-600 tracking-widest leading-none">BACABAL-MA</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">Olá, {name || 'Administrador'}</span>
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200">
              {(name || 'A').charAt(0).toUpperCase()}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:bg-red-50 hover:text-red-600">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Estoque & Cadastros</h2>
            <p className="text-gray-500">Gerencie o inventário da SS Móveis com ajuda da IA.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} icon={<Plus size={20} />} className="shadow-lg shadow-brand-200 hover:shadow-brand-300">
            Novo Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
             <div>
               <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total em Estoque</p>
               <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
             </div>
             <div className="p-4 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors"><Package size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
             <div>
               <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Categorias</p>
               <p className="text-3xl font-bold text-gray-900 mt-1">{new Set(items.map(i => i.category)).size}</p>
             </div>
             <div className="p-4 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><LayoutDashboard size={24} /></div>
          </div>
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
             <div>
               <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">IA Gemini</p>
               <p className="text-3xl font-bold text-gray-900 mt-1">Ativa</p>
             </div>
             <div className="p-4 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><Sparkles size={24} /></div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between gap-4">
            <h3 className="font-semibold text-gray-900 whitespace-nowrap">Itens Recentes</h3>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Buscar móveis..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-shadow" />
            </div>
          </div>
          
          {items.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900">Nenhum móvel cadastrado</p>
              <p className="mb-6">Comece adicionando novos itens ao estoque.</p>
              <Button variant="outline" onClick={() => setShowAddModal(true)} className="text-brand-600 border-brand-200 hover:bg-brand-50">Cadastrar Primeiro Item</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Móvel</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4 w-1/3">Descrição IA</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-50/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 shadow-sm">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <p className="line-clamp-2" title={item.description}>{item.description}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{item.createdAt}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-600 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Armchair size={20} /> Cadastrar Móvel
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Nome do Móvel" 
                  placeholder="Ex: Cama Box King" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
                <Input 
                  label="Categoria" 
                  placeholder="Ex: Quarto" 
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input 
                  label="Detalhes (para IA)" 
                  placeholder="Ex: madeira maciça, rústico, acabamento em verniz" 
                  value={newItemKeywords}
                  onChange={(e) => setNewItemKeywords(e.target.value)}
                  className="mb-1"
                />
                <p className="text-xs text-gray-400 flex items-center gap-1"><Sparkles size={10} className="text-brand-500"/> A IA usará esses detalhes para criar um texto vendedor.</p>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Descrição Comercial</label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={!newItemName || !newItemCategory || isGeneratingAI}
                    className="text-xs flex items-center gap-1 text-white bg-brand-500 px-2 py-1 rounded-md font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-brand-200"
                  >
                    {isGeneratingAI ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    {isGeneratingAI ? 'Criando...' : 'Gerar com IA'}
                  </button>
                </div>
                <TextArea 
                  rows={4}
                  placeholder="Digite manualmente ou clique em 'Gerar com IA'..."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="bg-gray-50 focus:bg-white resize-none"
                />
                {isGeneratingAI && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-lg border border-brand-100 z-10 backdrop-blur-[1px]">
                        <div className="relative">
                          <div className="absolute inset-0 bg-brand-200 rounded-full animate-ping opacity-75"></div>
                          <Loader2 className="w-8 h-8 text-brand-600 animate-spin relative z-10" />
                        </div>
                        <span className="text-sm font-bold text-brand-600 mt-2 animate-pulse">Consultando Especialista...</span>
                    </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 shadow-lg shadow-brand-200">
                  <CheckCircle2 size={18} className="mr-2" />
                  Salvar Cadastro
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {view === 'dashboard' ? renderDashboard() : renderAuth()}
    </>
  );
};

// Helper component for Loader
const Loader2 = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-loader-2 ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default App;