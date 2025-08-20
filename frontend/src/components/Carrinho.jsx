import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaCreditCard, FaSpinner, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { useCarrinho } from '../context/CarrinhoContext';
import './Carrinho.css';

const Carrinho = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { 
    carrinhoItems, 
    removeFromCarrinho, 
    updateQuantity,
    clearCarrinho,
    totalItens,
    totalPreco 
  } = useCarrinho();

  const handleFinalizarCompra = () => {
    if (carrinhoItems.length === 0) return;
    
    setLoading(true);
    
    // Simula um processamento assíncrono
    setTimeout(() => {
      navigate('/pagamento');
      setLoading(false);
    }, 1000);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCarrinho(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleClearCart = () => {
    if (window.confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      clearCarrinho();
    }
  };

  return (
    <div className="carrinho-container">
      {/* Header */}
      <div className="carrinho-header">
        <button 
          onClick={handleContinueShopping}
          className="back-button"
        >
          <FaArrowLeft /> Continuar Comprando
        </button>
        
        <h1 className="carrinho-title">
          <FaShoppingCart /> Meu Carrinho
        </h1>
        
        <div className="carrinho-stats">
          <span className="items-count">{totalItens} item{totalItens !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {carrinhoItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Seu carrinho está vazio</h2>
            <p>Que tal explorar nossas deliciosas pizzas?</p>
            <button 
              onClick={handleContinueShopping}
              className="continue-shopping-btn"
            >
              Ver Cardápio
            </button>
          </div>
        </div>
      ) : (
        <div className="carrinho-content">
          {/* Cart Items */}
          <div className="carrinho-items">
            {carrinhoItems.map(item => {
              const subtotal = (item.preco || 0) * (item.quantity || 1);

              return (
                <div key={item.id} className="carrinho-item">
                  <div className="item-image">
                    <img 
                      src={item.imagem || '/imagens/capas/padrao.jpg'} 
                      alt={item.nome} 
                      onError={(e) => {
                        e.target.src = '/imagens/capas/padrao.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.nome || 'Produto sem nome'}</h3>
                    <p className="item-price-unit">
                      R$ {(item.preco || 0).toFixed(2).replace('.', ',')} cada
                    </p>
                    
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                        className="quantity-btn"
                        disabled={loading}
                      >
                        <FaMinus />
                      </button>
                      
                      <span className="quantity-display">
                        {item.quantity || 1}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                        className="quantity-btn"
                        disabled={loading}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <p className="item-subtotal">
                      Subtotal: R$ {subtotal.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCarrinho(item.id)}
                    className="remove-item-btn"
                    disabled={loading}
                    title="Remover item"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="carrinho-summary">
            <div className="summary-card">
              <h3 className="summary-title">Resumo do Pedido</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Itens ({totalItens})</span>
                  <span>R$ {totalPreco.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="summary-row">
                  <span>Taxa de entrega</span>
                  <span>Grátis</span>
                </div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="total-price">
                    R$ {totalPreco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="summary-actions">
                <button 
                  onClick={handleFinalizarCompra}
                  className="checkout-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spin" /> Processando...
                    </>
                  ) : (
                    <>
                      <FaCreditCard /> Finalizar Compra
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleClearCart}
                  className="clear-cart-btn"
                  disabled={loading}
                >
                  <FaTrash /> Esvaziar Carrinho
                </button>
              </div>

              {/* Promo Code (opcional) */}
              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Código promocional"
                  className="promo-input"
                />
                <button className="promo-btn">Aplicar</button>
              </div>
            </div>

            {/* Security Badges */}
            <div className="security-badges">
              <div className="security-item">
                <div className="security-icon">🔒</div>
                <span>Compra 100% segura</span>
              </div>
              <div className="security-item">
                <div className="security-icon">🚚</div>
                <span>Entrega rápida</span>
              </div>
              <div className="security-item">
                <div className="security-icon">💳</div>
                <span>Pagamento seguro</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;