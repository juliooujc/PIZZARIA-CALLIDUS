import React from 'react'

const Pizza = ({pizza}) => (
  <main className='principal'>
    <div className='pag-pizza'>
      <h2>{pizza.nome}</h2>
      <div className='pizza'>
        <img
          src={"/imagens/" + pizza.id +".jpg"}
          alt='Thumbnail da capa do livro...'
        />
        <ul>
          <li>Ingredientes: {pizza.ingrediente}</li>
          <li>Preços: R${pizza.preco},00</li>
        </ul>
        <h3>Descrição da pizza</h3>
        <p>{pizza.descricao}</p>
      </div>
    </div>
  </main>
);
export default Pizza;