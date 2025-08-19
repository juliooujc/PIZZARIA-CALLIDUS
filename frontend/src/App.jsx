import React, { useEffect, useState } from "react";
import { Route, Routes, useParams, BrowserRouter, Link, Navigate } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import axios from "axios";
import Pizza from "./components/Pizza";
import Topo from "./components/Topo";
import Rodape from "./components/Rodape";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Carrinho from "./components/Carrinho";
import Pagamento from "./components/Pagamento";
import Login from "./components/login/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css"

// Componente de navegação protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Nav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { carrinhoItems } = useCarrinho();

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">
            <FaHome /> Cardápio
          </Link>
        </li>
        <li>
          <Link to="/carrinho">
            <FaShoppingCart /> Carrinho ({carrinhoItems.reduce((sum, item) => sum + item.quantity, 0)})
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <span className="user-welcome">
                <FaUser /> Olá, {user?.name}
              </span>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt /> Sair
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">
              <FaUser /> Entrar
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

// Hook personalizado para o carrinho
const useCarrinho = () => {
  const [carrinhoItems, setCarrinhoItems] = useState([]);

  const addToCarrinho = (produto) => {
    setCarrinhoItems(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantity: item.quantity + produto.quantity }
            : item
        );
      }
      return [...prev, produto];
    });
  };

  const removeFromCarrinho = (produtoId) => {
    setCarrinhoItems(prev => prev.filter(item => item.id !== produtoId));
  };

  const clearCarrinho = () => {
    setCarrinhoItems([]);
  };

  return {
    carrinhoItems,
    addToCarrinho,
    removeFromCarrinho,
    clearCarrinho
  };
};

const PizzaRouteHandler = ({ pizzas }) => {
  const { pizzaSlug } = useParams();
  const { addToCarrinho } = useCarrinho();
  const pizza = pizzas.find(p => p.slug === pizzaSlug);

  if (!pizza) return <NotFound />;
  return <Pizza pizza={pizza} addToCarrinho={addToCarrinho} />;
}

const AppContent = () => {
  const [pizzas, setPizzas] = useState([]);
  const [erro, setErro] = useState(null);
  const carrinho = useCarrinho();
  
  const totalCarrinho = carrinho.carrinhoItems.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

  useEffect(() => {
    const carregarPizzas = async () => {
      try {
        const response = await axios.get("/api/todasAsPizzas.json");
        const dados = response.data;
        
        const pizzasFormatadas = dados.map(pizza => ({
          ...pizza,
          slug: pizza.slug || pizza.nome.toLowerCase().replace(/\s+/g, '-'),
          disponivel: pizza.disponivel !== false,
          preco: Number(pizza.preco) || 0
        }));
        
        setPizzas(pizzasFormatadas);
      } catch (error) {
        console.error("Erro ao carregar:", error);
        setErro(`Erro ao carregar: ${error.message}`);
      }
    };

    carregarPizzas();
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Nav />
        <Topo />
        <main className="principal">
          {erro && <p className="erro">{erro}</p>}
          <Routes>
            <Route path="/" element={<Home pizzas={pizzas} addToCarrinho={carrinho.addToCarrinho} />} />
            <Route path="/pizza/:pizzaSlug" element={<PizzaRouteHandler pizzas={pizzas} />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route path="/pagamento" element={
              <ProtectedRoute>
                <Pagamento 
                  total={totalCarrinho} 
                  clearCarrinho={carrinho.clearCarrinho}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/carrinho" element={
              <Carrinho 
                items={carrinho.carrinhoItems} 
                removeFromCarrinho={carrinho.removeFromCarrinho} 
              />
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Rodape />
      </BrowserRouter>
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;