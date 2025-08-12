import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Pizza from "./components/Pizza";
import NotFound from "./components/NotFound";

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
                const response = await axios.get("/api/todosAsPizzas.json");
                setPizzas(response.data);
            } catch (error) {
                console.error("Erro ao carregar as pizzas:", error);
                setErro("Falha ao carregar as pizzas. Tente novamente mais tarde!");
            }
        };
        
        carregarPizzas(); // Chamar a função
    }, []);

    // Adicionar retorno do componente
    return (
        <div>
            {erro && <p>{erro}</p>}
            {/* Aqui você precisaria adicionar o roteador e as rotas */}
        </div>
    );
}

export default App;