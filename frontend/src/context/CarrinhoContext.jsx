// src/context/CarrinhoContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};

export const CarrinhoProvider = ({ children }) => {
  const [carrinhoItems, setCarrinhoItems] = useState([]);

  const addToCarrinho = (produto) => {
    setCarrinhoItems(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantity: item.quantity + (produto.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...produto, quantity: produto.quantity || 1 }];
    });
  };

  const removeFromCarrinho = (produtoId) => {
    setCarrinhoItems(prev => prev.filter(item => item.id !== produtoId));
  };

  const clearCarrinho = () => {
    setCarrinhoItems([]);
  };

  const updateQuantity = (produtoId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCarrinho(produtoId);
      return;
    }
    
    setCarrinhoItems(prev =>
      prev.map(item =>
        item.id === produtoId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const totalItens = carrinhoItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPreco = carrinhoItems.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

  const value = {
    carrinhoItems,
    addToCarrinho,
    removeFromCarrinho,
    clearCarrinho,
    updateQuantity,
    totalItens,
    totalPreco
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export default CarrinhoProvider;