import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import './Pizza.css';

const Pizza = ({ pizza, addToCarrinho }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCarrinho = () => {
    addToCarrinho({
      id: pizza.id,
      nome: pizza.nome,
      preco: pizza.preco,
      quantity: quantity,
      imagem: `/imagens/capas/${pizza.id}.jpg`
    });
    setAdded(true);
    setQuantity(1); // ← Resetar para 1 após adicionar
    setTimeout(() => setAdded(false), 2000);
  };

  if (!pizza) {
    return <div>Pizza não encontrada</div>;
  }

  // Verifica se ingrediente é array ou string
  const ingredientes = Array.isArray(pizza.ingrediente) 
    ? pizza.ingrediente.join(', ') 
    : pizza.ingrediente;

  return (
    <main className='principal'>
      <div className='pag-pizza'>
        <div className='div'>
          <button 
            onClick={() => navigate('/')}
            className="botao-voltar"
          >
            <FaArrowLeft /> Voltar para o cardápio
          </button>
          
          <h1>{pizza.nome}</h1>
          
          <img
            className='img'
            src={`/imagens/capas/${pizza.id}.jpg`}
            alt={pizza.nome}
            onError={(e) => {
              e.target.src = '/imagens/capas/padrao.jpg';
            }}
          />
          
          <div className='detalhes-pizza'>
            <h3>Ingredientes:</h3>
            <p>{ingredientes}</p>
            
            <h3>Descrição:</h3>
            <p>{pizza.descricao}</p>

            {pizza.tamanho && <h3>Tamanho: {pizza.tamanho}</h3>}
            
            <p className='preco'>Preço: R$ {pizza.preco.toFixed(2).replace('.', ',')}</p>
            
            <div className="quantidade-container">
              <label htmlFor="quantidade">Quantidade: </label>
              <input 
                id="quantidade"
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantidade-input"
              />
            </div>
            
            <button 
              onClick={handleAddToCarrinho} 
              disabled={added}
              className="button"
            >
              {added ? 'Pedido adicionado!' : <><FaShoppingCart /> Adicionar ao Carrinho</>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pizza;