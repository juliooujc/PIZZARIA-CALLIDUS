import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaSpinner, FaPlus, FaMinus, FaArrowLeft, FaUtensils, FaHome } from 'react-icons/fa';
import { useCarrinho } from '../../context/CarrinhoContext';
import './Carrinho.css';

// Componente reutilizável de item da comanda
const ComandaItem = ({ item, onUpdateQuantity, onRemove, loading }) => {
  const subtotal = (item.preco || 0) * (item.quantity || 1);

  return (
    <div className="comanda-item">
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
            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
            className="quantity-btn"
            disabled={loading}
          >
            <FaMinus />
          </button>
          
          <span className="quantity-display">
            {item.quantity || 1}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
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
        onClick={() => onRemove(item.id)}
        className="remove-item-btn"
        disabled={loading}
        title="Remover item"
      >
        <FaTrash />
      </button>
    </div>
  );
};

const Carrinho = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState('mesa'); // 'mesa' ou 'delivery'
  const [numeroMesa, setNumeroMesa] = useState('');
  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    bairro: '',
    complemento: ''
  });
  
  const { 
    carrinhoItems, 
    removeFromCarrinho, 
    updateQuantity,
    clearCarrinho,
    totalItens,
    totalPreco 
  } = useCarrinho();

  const handleEnviarCozinha = async () => {
    if (carrinhoItems.length === 0) {
      alert('Adicione itens ao pedido antes de enviar para a cozinha!');
      return;
    }

    if (tipoEntrega === 'mesa' && !numeroMesa) {
      alert('Informe o número da mesa!');
      return;
    }

    if (tipoEntrega === 'delivery' && (!endereco.rua || !endereco.numero || !endereco.bairro)) {
      alert('Preencha todos os campos obrigatórios do endereço!');
      return;
    }

    setLoading(true);
    
      try {
      const pedidoData = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        itens: carrinhoItems,
        total: totalPreco,
        tipoEntrega,
        ...(tipoEntrega === 'mesa' && { mesa: numeroMesa }),
        ...(tipoEntrega === 'delivery' && { endereco }),
        timestamp: new Date().toISOString(),
        status: 'preparacao' // Status inicial
      };

      // Salva no localStorage para a cozinha acessar
      const pedidosCozinhaExistentes = JSON.parse(localStorage.getItem('pedidosCozinha') || '[]');
      const novosPedidosCozinha = [...pedidosCozinhaExistentes, pedidoData];
      localStorage.setItem('pedidosCozinha', JSON.stringify(novosPedidosCozinha));

      console.log('Pedido enviado para cozinha:', pedidoData);
      
    
    // Limpa carrinho mas fica na página
      clearCarrinho();

      // Reseta os campos de entrega para novo pedido
      setNumeroMesa('');
      setEndereco({
        rua: '',
        numero: '',
        bairro: '',
        complemento: ''
      });
      setTipoEntrega('mesa');
      
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
    if (window.confirm('Tem certeza que deseja esvaziar a comanda?')) {
      clearCarrinho();
    }
  };

  return (
    <div className="carrinho-container">
      <div className="carrinho-header">
        <button 
          onClick={handleContinueShopping}
          className="back-button"
        >
          <FaArrowLeft /> Continuar Comprando
        </button>
        
        <h1 className="carrinho-title">
          <FaUtensils /> Minha Comanda
        </h1>
        
        <div className="carrinho-stats">
          <span className="items-count">{totalItens} item{totalItens !== 1 ? 's' : ''}</span>
          <span className="total-price-display">
            Total: R$ {totalPreco.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {carrinhoItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Sua comanda está vazia</h2>
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
          <div className="entrega-section">
            <h3>Tipo de Entrega</h3>
            <div className="entrega-options">
              <label className="entrega-option">
                <input
                  type="radio"
                  value="mesa"
                  checked={tipoEntrega === 'mesa'}
                  onChange={(e) => setTipoEntrega(e.target.value)}
                />
                <FaUtensils /> Mesa
              </label>
              
              <label className="entrega-option">
                <input
                  type="radio"
                  value="delivery"
                  checked={tipoEntrega === 'delivery'}
                  onChange={(e) => setTipoEntrega(e.target.value)}
                />
                <FaHome /> Delivery
              </label>
            </div>

            {tipoEntrega === 'mesa' && (
              <div className="mesa-input">
                <label>Número da Mesa:</label>
                <input
                  type="number"
                  min="1"
                  value={numeroMesa}
                  onChange={(e) => setNumeroMesa(e.target.value)}
                  placeholder="Ex: 1"
                />
              </div>
            )}

            {tipoEntrega === 'delivery' && (
              <div className="endereco-form">
                <h4>Endereço de Entrega</h4>
                <div className="endereco-fields">
                  <input
                    type="text"
                    placeholder="Rua"
                    value={endereco.rua}
                    onChange={(e) => setEndereco({...endereco, rua: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    value={endereco.numero}
                    onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={endereco.bairro}
                    onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Complemento (opcional)"
                    value={endereco.complemento}
                    onChange={(e) => setEndereco({...endereco, complemento: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="comanda-items">
            <h3>Itens da Comanda</h3>
            {carrinhoItems.map(item => (
              <ComandaItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleQuantityChange}
                onRemove={removeFromCarrinho}
                loading={loading}
              />
            ))}
          </div>
          <div className="comanda-summary">
            <div className="summary-card">
              <h3 className="summary-title">Resumo da Comanda</h3>
              
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
                  onClick={handleEnviarCozinha}
                  className="enviar-cozinha-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <FaUtensils /> Enviar para Cozinha
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleClearCart}
                  className="clear-cart-btn"
                  disabled={loading}
                >
                  <FaTrash /> Limpar Comanda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;