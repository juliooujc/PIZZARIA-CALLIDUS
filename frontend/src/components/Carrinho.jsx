import React, { useState } from 'react'; // Adicione o useState import
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaCreditCard, FaSpinner } from 'react-icons/fa';
import './Carrinho.css';

const Carrinho = ({ items, removeFromCarrinho }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado para loading
  
  // Função para calcular o total com segurança
  const calcularTotal = () => {
    return items.reduce((sum, item) => {
      const preco = item.preco || 0;
      const quantidade = item.quantity || 1;
      return sum + (preco * quantidade);
    }, 0);
  };

  const total = calcularTotal();

  // Função para finalizar compra com loading
  const handleFinalizarCompra = () => {
    if (items.length === 0) return;
    
    setLoading(true);
    
    // Simula um processamento assíncrono (como verificação de estoque)
    setTimeout(() => {
      navigate('/pagamento');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="carrinho-container">
      <h2><FaShoppingCart /> Carrinho de Compras</h2>
      
      {items.length === 0 ? (
        <p>Seu carrinho está vazio</p>
      ) : (
        <>
          {items.map(item => {
            const preco = item.preco || 0;
            const quantidade = item.quantity || 1;
            const subtotal = preco * quantidade;

            return (
              <div key={item.id} className="carrinho-item">
                <div className="item-info">
                  <h3>{item.nome || 'Produto sem nome'}</h3>
                  {item.imagem && (
                    <img 
                      src={item.imagem} 
                      alt={item.nome} 
                      className="item-imagem"
                    />
                  )}
                  <p>R$ {preco.toFixed(2)} x {quantidade} = R$ {subtotal.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => removeFromCarrinho(item.id)}
                  className="botao-remover"
                  disabled={loading} // Desabilita durante o loading
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
          
          <div className="carrinho-total">
            <h3>Total: R$ {total.toFixed(2)}</h3>
            
            {/* Botão de finalizar compra com todas as funcionalidades */}
            <button 
              onClick={handleFinalizarCompra}
              className="botao-pagamento"
              disabled={items.length === 0 || loading}
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
          </div>
        </>
      )}
    </div>
  );
};

export default Carrinho;