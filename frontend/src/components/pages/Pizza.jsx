import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaStar, FaClock, FaWeight } from 'react-icons/fa';
import { useCarrinho } from '../../context/CarrinhoContext';
import './Pizza.css';

const Pizza = ({ pizza }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCarrinho } = useCarrinho();

  const handleAddToCarrinho = () => {
    addToCarrinho({
      id: pizza.id,
      nome: pizza.nome,
      preco: pizza.preco,
      quantity: quantity,
      imagem: `/imagens/capas/${pizza.id}.jpg`
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  };

  if (!pizza) {
    return (
      <main className='principal'>
        <div className="pizza-not-found">
          <h2>Pizza não encontrada</h2>
          <button 
            onClick={() => navigate('/')}
            className="back-to-menu-btn"
          >
            <FaArrowLeft /> Voltar ao Cardápio
          </button>
        </div>
      </main>
    );
  }

  const ingredientes = Array.isArray(pizza.ingrediente) 
    ? pizza.ingrediente 
    : pizza.ingrediente.split(',').map(item => item.trim());

  const isPremium = pizza.preco > 40;

  return (
    <main className='principal'>
      <div className="breadcrumb">
        <button 
          onClick={() => navigate('/')}
          className="breadcrumb-btn"
        >
          Cardápio
        </button>
        <span>/</span>
        <span className="breadcrumb-current">{pizza.nome}</span>
      </div>

      <div className='pizza-detail-container'>
        <div className='pizza-image-section'>
          <div className='pizza-image-wrapper'>
            <img
              className='pizza-detail-image'
              src={`/imagens/capas/${pizza.id}.jpg`}
              alt={pizza.nome}
              onError={(e) => {
                e.target.src = '/imagens/capas/padrao.jpg';
              }}
            />
            {isPremium && (
              <div className="premium-badge-large">
                 Premium
              </div>
            )}
          </div>
        </div>

        <div className='pizza-info-section'>
          <div className='pizza-header'>
            <h1 className='pizza-title'>{pizza.nome}</h1>
            <div className="pizza-meta">
              {pizza.tempoPreparo && (
                <span className="meta-item">
                  {pizza.tempoPreparo} min
                </span>
              )}
              {pizza.peso && (
                <span className="meta-item">
                  {pizza.peso}
                </span>
              )}
            </div>
          </div>

          <div className='pizza-price-large'>
            R$ {pizza.preco.toFixed(2).replace('.', ',')}
          </div>

          <div className='pizza-description-detailed'>
            <h3>Sobre esta pizza</h3>
            <p>{pizza.descricao}</p>
          </div>

          <div className='ingredients-section'>
            <h3>Ingredientes</h3>
            <div className='ingredients-grid'>
              {ingredientes.map((ingrediente, index) => (
                <span key={index} className='ingredient-tag'>
                  {ingrediente}
                </span>
              ))}
            </div>
          </div>

          <div className='order-section'>
            <h3>Faça seu pedido</h3>
            
            <div className="quantity-selector">
              <label htmlFor="quantidade">Quantidade:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <input 
                  id="quantidade"
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                />
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-price">
              Total: R$ {(pizza.preco * quantity).toFixed(2).replace('.', ',')}
            </div>

            <button 
              onClick={handleAddToCarrinho} 
              disabled={added}
              className={`add-to-cart-btn-large ${added ? 'added' : ''}`}
            >
              {added ? (
                <>
                  Adicionado ao Carrinho!
                </>
              ) : (
                <>
                  Adicionar {quantity} ao Carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pizza;