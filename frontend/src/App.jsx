import React, { useEffect, useState } from "react";
import { Route, Routes, useParams, BrowserRouter, Link } from "react-router-dom";
import styled from 'styled-components';
import { FaHome, FaShoppingCart } from 'react-icons/fa';
import axios from "axios";
import Pizza from "./components/Pizza";
import Topo from "./components/Topo";
import Rodape from "./components/Rodape";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Carrinho from "./components/Carrinho";
import Pagamento from "./components/Pagamento";
import "./App.css"

const Nav = ({ children }) => (
  <nav className="nav">
    {children}
  </nav>
);

const PizzaRouteHandler = ({ pizzas, addToCarrinho }) => {
    const { pizzaSlug } = useParams();
    const pizza = pizzas.find(p => p.slug === pizzaSlug);

    if (!pizza) return <NotFound />;
  return <Pizza pizza={pizza} addToCarrinho={addToCarrinho} />;
}

const App = () => {
    const [pizzas, setPizzas] = useState([]);
    const [erro, setErro] = useState(null);
    const [carrinhoItems, setCarrinhoItems] = useState([]);
    const totalCarrinho = carrinhoItems.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    const addToCarrinho = (produto) => {
      setCarrinhoItems(prev => {
        const itemExistente = prev.find(item => item.id === produto.id);
        if (itemExistente) {
          return prev.map(item =>
            item.id === produto.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...produto, quantity: 1 }];
      });
    };

    const removeFromCarrinho = (produtoId) => {
      setCarrinhoItems(prev => prev.filter(item => item.id !== produtoId));
    };

    useEffect(() => {
        const carregarPizzas = async () => {
            try {
                const response = await axios.get("/api/todasAsPizzas.json");
                const dados = response.data;
                
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

    return (
        <div className="app">
            <BrowserRouter>
                <Nav>
                    <ul>
                        <li>
                            <Link to="/">
                                <FaHome /> Cardápio
                            </Link>
                        </li>
                        <li>
                            <Link to="/carrinho">
                                <FaShoppingCart /> Carrinho ({carrinhoItems.reduce((sum, item) => sum + item.quantity, 0)})
                            </Link>
                        </li>
                    </ul>
                </Nav>

                <Topo />
                <main className="principal">
                    {erro && <p className="erro">{erro}</p>}
                    <Routes>
                        <Route path="/" element={<Home pizzas={pizzas} addToCarrinho={addToCarrinho} />} />
                        <Route path="/pizza/:pizzaSlug" element={<PizzaRouteHandler pizzas={pizzas} addToCarrinho={addToCarrinho} />} />
                        <Route path="/notfound" element={<NotFound />} />
                        <Route path="/pagamento" element={<Pagamento total={totalCarrinho} />} />
                        <Route path="/carrinho" element={
                            <Carrinho 
                                items={carrinhoItems} 
                                removeFromCarrinho={removeFromCarrinho} 
                            />
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Rodape />
            </BrowserRouter>
        </div>
    );
}

export default App;