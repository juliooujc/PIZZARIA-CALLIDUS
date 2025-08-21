import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPizzaSlice, FaArrowLeft, FaSearch } from 'react-icons/fa';
import './NotFound.css'; // Vamos criar este CSS

const NotFound = () => {
  // Lista de pizzas populares para sugerir
  const pizzasSugeridas = [
    { nome: "Calabresa", slug: "calabresa" },
    { nome: "Margherita", slug: "margherita" },
    { nome: "Portuguesa", slug: "portuguesa" },
    { nome: "Quatro Queijos", slug: "quatro-queijos" }
  ];

  return (
    <main className='principal not-found-container'>
      <div className="not-found-content">
        {/* Ilustração/Imagem */}
        <div className="not-found-illustration">
          <div className="pizza-slice">
            <FaPizzaSlice className="pizza-icon" />
          </div>
          <div className="error-number">404</div>
        </div>

        {/* Mensagem de erro */}
        <div className="not-found-message">
          <h1>Ops! Página não encontrada</h1>
          <p>Parece que a pizza que você está procurando saiu do forno!</p>
          <p className="not-found-subtext">
            A página que você tentou acessar não existe ou foi removida.
          </p>
        </div>

        {/* Ações */}
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn primary">
            <FaHome /> Voltar para o Início
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="not-found-btn secondary"
          >
            <FaArrowLeft /> Voltar à Página Anterior
          </button>
        </div>

        {/* Sugestões */}
        <div className="not-found-suggestions">
          <h3>
            <FaSearch /> Que tal experimentar essas pizzas?
          </h3>
          <div className="suggestions-grid">
            {pizzasSugeridas.map((pizza, index) => (
              <Link 
                key={index} 
                to={`/pizza/${pizza.slug}`} 
                className="pizza-suggestion"
              >
                <span>{pizza.nome}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contato */}
        <div className="not-found-contact">
          <p>Precisa de ajuda?</p>
          <a href="tel:+551199999999" className="contact-link">
            📞 (92) 9999-9999
          </a>
          <a href="mailto:contato@pizzaria.com" className="contact-link">
            ✉️ contato@pizzaria.com
          </a>
        </div>
      </div>
    </main>
  );
};

export default NotFound;