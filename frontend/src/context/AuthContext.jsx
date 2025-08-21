import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock function simplificada
const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Dados mockados simples - apenas usuário comum
      const users = [
        { 
          id: 1, 
          email: 'maelle@gmail.com', 
          password: 'alicia', 
          name: 'Malle'
        },
        { 
          id: 2, 
          email: 'admin_aline@gmail.com', 
          password: 'artificie', 
          name: 'Administradora Artífice'
        }
      ];

      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        resolve({
          success: true,
          token: 'mock-jwt-token-' + user.id,
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name
          }
        });
      } else {
        reject(new Error('Email ou senha inválidos'));
      }
    }, 1000);
  });
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Componente Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token armazenado ao carregar a aplicação
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await mockLogin(email, password);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name
        };
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user/', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.message || 'Erro ao fazer login' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;