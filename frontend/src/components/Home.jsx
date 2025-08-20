import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaFire } from 'react-icons/fa';
import { useCarrinho } from '../context/CarrinhoContext';
import './Home.css';

const Home = ({ pizzas }) => {
  const navigate = useNavigate();
  const { addToCarrinho } = useCarrinho();

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

  const handleAddToCarrinho = (pizza, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCarrinho({
      id: pizza.id,
      nome: pizza.nome,
      preco: pizza.preco,
      quantity: 1,
      imagem: `/imagens/capas/${pizza.id}.jpg`
    });
  };

  const handlePizzaClick = (pizzaSlug) => {
    navigate(`/pizza/${pizzaSlug}`);
  };

  const pizzasDestaque = pizzas.slice(0, 8);

  return (
    <main className='home-container'>
      {/* Hero Section Minimalista */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Pizzaria Callidus</h1>
          <p>Sabores autênticos, entregas rápidas</p>
          <div className="hero-stats">
            <div className="stat">
              <FaFire />
              <span>+{pizzas.length} sabores</span>
            </div>
            <div className="stat">
              <FaStar />
              <span>4.8 ⭐</span>
            </div>
          </div>
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
                  
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => handleAddToCarrinho(pizza, e)}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Minimalista */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Pronto para pedir?</h2>
          <p>Explore todo o nosso cardápio de sabores</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/')}
          >
            Ver Cardápio Completo
          </button>
        </div>
      </section>
    </main>
  );   
};

export default Home;