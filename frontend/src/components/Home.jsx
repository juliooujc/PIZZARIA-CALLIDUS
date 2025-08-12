import React from "react";
import {Link} from 'react-router-dom'

const Home = ({pizzas}) => (
    <main className="principal">
        <h2>Últimos lançamentos</h2>
        {pizzas
        .filter((n,index) => index < 6)}
        .map((pizza) => (
            <div className='card' key={pizzas.id}>
                <div classname="thumb">
                    <img
                        src={"/imagens/capas/" + livro.isbn.replace(/-/g,"") +".jpg"}
                        alt='"Thumbnail da capa do livro...'
                    />
                </div>
                {pizzas
                    .filter((c)) => c.slug == pizza.slug)
                    .map((pizza) => (
                        <span key={pizzas.slug} >
                            <link to={`/pizza/}
                        </span>
                    ))
                }
            </div>
        ))

    </main>

);

export default Home;