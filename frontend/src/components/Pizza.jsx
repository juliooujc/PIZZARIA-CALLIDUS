import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Pizza.css';

const Pizza = ({ pizza }) => {
  const navigate = useNavigate();

  if (!pizza) {
    return <div>Pizza não encontrada</div>;
  }

  return (
    <main className='principal'>
      <div className='pag-pizza'>
        <button 
          onClick={() => navigate('/')}
          className="botao-voltar"
        >
          <FaArrowLeft /> Voltar para Home
        </button>
        
        <h2>{pizza.nome}</h2>
        <div className='pizza'>
          <img
            src={`/imagens/capas/${pizza.id}.jpg`}
            alt={`Capa da pizza ${pizza.nome}`}
            onError={(e) => {
              e.target.src = '/imagens/capas/padrao.jpg'; // Fallback para imagem
            }}
          />
          <div className='detalhes-pizza'>
            <h3>Ingredientes:</h3>
            <p>{pizza.ingrediente}</p>
            
            <h3>Descrição:</h3>
            <p>{pizza.descricao}</p>
            
            <p className='preco'>Preço: R${pizza.preco.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pizza;