import React, { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import axios from "axios";
import Pizza from "./components/Pizza";
import Topo from "./components/Topo";
import Rodape from "./components/Rodape";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import "./App.css"

const PizzaRouteHandler = ({ pizzas }) => {
    const { pizzaSlug } = useParams();
    const pizza = pizzas.find(l => l.slug === pizzaSlug);

    if (!pizza) return <NotFound />;
    return <Pizza pizza={pizza} />;
}

const App = () => {
    const [pizzas, setPizzas] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregarPizzas = async () => {
            try {
                const response = await axios.get("/api/todasAsPizzas.json"); // Note o nome corrigido
                const dados = response.data;
                
                // Adiciona campos faltantes se necessário
                const pizzasFormatadas = dados.map(pizza => ({
                    ...pizza,
                    slug: pizza.slug || pizza.nome.toLowerCase().replace(/\s+/g, '-'),
                    disponivel: pizza.disponivel !== false,
                    preco: Number(pizza.preco) || 0
                }));
                
                setPizzas(pizzasFormatadas);
            } catch (error) {
                console.error("Erro ao carregar:", error);
                setErro(`Erro ao carregar: ${error.message}`);
            }
        };
    
    carregarPizzas();
}, []);

    // Adicionar retorno do componente
  return (
    <>
      <Topo />
      <main className="principal">
        {erro && <p className="erro">{erro}</p>}
        <Routes>
          <Route path="/" element={<Home pizzas={pizzas}/>}/>
          <Route path="/pizza/:pizzaSlug" 
            element={<PizzaRouteHandler pizzas = {pizzas}/>}
          />
          <Route path="/notfound" element={<NotFound/>}/>
        </Routes>
      </main>
      <Rodape />
    </>
  );
}

export default App;