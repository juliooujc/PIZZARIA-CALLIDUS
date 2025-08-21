import React, { useEffect, useState } from "react";
import { Route, Routes, useParams, BrowserRouter, Link, Navigate } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUser, FaSignOutAlt, FaUtensils, FaMotorcycle } from 'react-icons/fa';
import axios from "axios";
import Pizza from "./components/pages/Pizza";
import Topo from "./components/Topo";
import Rodape from "./components/Rodape";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import Carrinho from "./components/pages/Carrinho";
import Cozinha from "./components/pages/Cozinha";
import Entregas from "./components/pages/Entregas";
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

const PizzaRouteHandler = ({ pizzas }) => {
  const { pizzaSlug } = useParams();
  const pizza = pizzas.find(p => p.slug === pizzaSlug);

  if (!pizza) return <NotFound />;
  return <Pizza pizza={pizza} />;
}

const AppContent = () => {
  const [pizzas, setPizzas] = useState([]);
  const [erro, setErro] = useState(null);
  const { isAuthenticated } = useAuth();
  const { carrinhoItems } = useCarrinho();

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