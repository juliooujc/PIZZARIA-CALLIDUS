import React from "react";
import { Link } from 'react-router-dom';

const Home = ({ pizzas }) => {
    if (!pizzas || !Array.isArray(pizzas)) {
        return <p>Carregando pizzas...</p>;
    }

    return (
        <main className='principal'>
            <h2>Pizzas do dia</h2>
            {pizzas
                .filter((_, index) => index < 10) // Mostra apenas as 6 primeiras
                .map((pizza) => (
                    <div className='card' key={pizza.id}>
                        <div className='thumb'>
                            <img
                                src={`/imagens/capas/${pizza.id}.jpg`}
                                alt={`Thumbnail da pizza ${pizza.nome}`}
                            />            
                        </div>
                        <Link to={`/pizza/${pizza.slug}`}>
                            <div className='detalhes'>
                                <h3>{pizza.nome}</h3>
                                <p>{pizza.descricao.slice(0, 130) + "..."}</p>
                                <p>Leia mais</p>
                            </div>
                        </Link>
                    </div>
                ))}
        </main>
    );   
};

export default Home;