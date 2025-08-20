import React, { useEffect, useState } from "react";
import { Route, Routes, useParams, BrowserRouter, Link, Navigate } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUser, FaSignOutAlt, FaUtensils, FaMotorcycle } from 'react-icons/fa';
import axios from "axios";
import Pizza from "./components/Pizza";
import Topo from "./components/Topo";
import Rodape from "./components/Rodape";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Carrinho from "./components/Carrinho";
import Pagamento from "./components/Pagamento";
import Cozinha from "./components/Cozinha";
import Entregas from "./components/Entregas";
import Login from "./components/login/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CarrinhoProvider, useCarrinho } from "./context/CarrinhoContext";
import "./App.css"

// Componente de navegação protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para redirecionar se já estiver logado
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

// Componente Nav separado
const Nav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItens } = useCarrinho();

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
            <FaShoppingCart /> Carrinho ({totalItens})
          </Link>
        </li>
        
        {/* Links para Cozinha e Entregas - todos os usuários autenticados podem acessar */}
        {isAuthenticated && (
          <>
            <li>
              <Link to="/cozinha">
                <FaUtensils /> Cozinha
              </Link>
            </li>
            <li>
              <Link to="/entregas">
                <FaMotorcycle /> Entregas
              </Link>
            </li>
          </>
        )}
        
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

const PizzaRouteHandler = ({ pizzas }) => {
  const { pizzaSlug } = useParams();
  const { addToCarrinho } = useCarrinho();
  const pizza = pizzas.find(p => p.slug === pizzaSlug);

  if (!pizza) return <NotFound />;
  return <Pizza pizza={pizza} />;
}

const AppContent = () => {
  const [pizzas, setPizzas] = useState([]);
  const [erro, setErro] = useState(null);
  const { isAuthenticated } = useAuth();
  const { totalPreco, clearCarrinho, carrinhoItems } = useCarrinho();

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
        {isAuthenticated && <Nav />}
        
        <Topo />
        <main className="principal">
          {erro && <p className="erro">{erro}</p>}
          <Routes>
            <Route path="/" element={
              isAuthenticated ? 
                <Home pizzas={pizzas} /> : 
                <Navigate to="/login" />
            } />
            
            <Route path="/pizza/:pizzaSlug" element={
              <ProtectedRoute>
                <PizzaRouteHandler pizzas={pizzas} />
              </ProtectedRoute>
            } />
            
            <Route path="/notfound" element={<NotFound />} />
            
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            <Route path="/pagamento" element={
              <ProtectedRoute>
                <Pagamento 
                  total={totalPreco} 
                  clearCarrinho={clearCarrinho}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/carrinho" element={
              <ProtectedRoute>
                <Carrinho 
                  items={carrinhoItems}
                />
              </ProtectedRoute>
            } />
            
            {/* Rota da Cozinha */}
            <Route path="/cozinha" element={
              <ProtectedRoute>
                <Cozinha />
              </ProtectedRoute>
            } />
            
            {/* Rota de Entregas */}
            <Route path="/entregas" element={
              <ProtectedRoute>
                <Entregas />
              </ProtectedRoute>
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
      <CarrinhoProvider>
        <AppContent />
      </CarrinhoProvider>
    </AuthProvider>
  );
}

export default App;