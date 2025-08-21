import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaFire } from 'react-icons/fa';
import { useCarrinho } from '../../context/CarrinhoContext';
import './Home.css';

const Home = ({ pizzas }) => {
  const navigate = useNavigate();

  if (!pizzas || !Array.isArray(pizzas)) {
    return (
      <main className='home-container'>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando cardápio...</p>
        </div>
      </main>
    );
  }
  const handlePizzaClick = (pizzaSlug) => {
    navigate(`/pizza/${pizzaSlug}`);
  };

  const pizzasDestaque = pizzas.slice(0, 10);

  return (
    <main className='home-container'>
      {/* Hero Section Minimalista */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Pizzaria Callidus</h1>
          <p>Sabores autênticos, entregas rápidas</p>
        </div>
      </section>

      {/* Pizzas em Destaque */}
      <section className="pizzas-section">
        <div className="section-header">
          <h2>Pizzas em Destaque</h2>
          <p>Nossas especialidades mais pedidas</p>
        </div>
        
        <div className="pizzas-grid">
          {pizzasDestaque.map((pizza) => (
            <div 
              className="pizza-card" 
              key={pizza.id}
              onClick={() => handlePizzaClick(pizza.slug)}
            >
              <div className="pizza-image">
                <img
                  src={`/imagens/capas/${pizza.id}.jpg`}
                  alt={`Pizza ${pizza.nome}`}
                  onError={(e) => {
                    e.target.src = '/imagens/capas/padrao.jpg';
                  }}
                />
              </div>
              
              <div className="pizza-content">
                <h3>{pizza.nome}</h3>
                <p className="pizza-description">
                  {pizza.descricao.slice(0, 80)}...
                </p>
                
                <div className="pizza-footer">
                  <span className="pizza-price">
                    R$ {pizza.preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );   
};

export default Home;