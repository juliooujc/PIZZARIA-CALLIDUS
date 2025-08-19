// Para integração com API real
export const authService = {
  async login(email, password) {
    // Exemplo com API real:
    /*
    const response = await fetch('https://sua-api.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer login');
    }

    return await response.json();
    */
    
    // Mock (substituir pela chamada real da API)
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = [
          { id: 1, email: 'usuario@email.com', password: 'senha123', name: 'Usuário Teste' },
          { id: 2, email: 'admin@email.com', password: 'admin123', name: 'Administrador' }
        ];

        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          resolve({
            success: true,
            token: 'jwt-token-' + user.id,
            user: { id: user.id, email: user.email, name: user.name }
          });
        } else {
          resolve({
            success: false,
            message: 'Credenciais inválidas'
          });
        }
      }, 1000);
    });
  },

  async logout() {
    // Limpar token da API se necessário
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};