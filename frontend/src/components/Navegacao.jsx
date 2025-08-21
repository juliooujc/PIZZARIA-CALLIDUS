import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaUtensils, 
  FaMotorcycle, 
  FaUserCog 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';
import './Navegacao.css';

const Navegacao = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItens } = useCarrinho();

  return (
    <nav className="nav">
      <ul>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/">
                <FaHome /> Cardápio
              </Link>
            </li>
            <li>
              <Link to="/carrinho">
                <FaShoppingCart /> Carrinho ({totalItens})
              </Link>
            </li>
            <li>
              <Link to="/cozinha">
                <FaUtensils /> Cozinha
              </Link>
            </li>
            <li>
              <Link to="/entregas">
                <FaMotorcycle /> Entregas
              </Link>
            </li>
            
          </>
        )}
        
        {isAuthenticated ? (
          <>
            <li>
              <span className="user-welcome">
                <FaUser /> Olá, {user?.name}
                {user?.role === 'admin' && ' (Admin)'}
              </span>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt /> Sair
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">
              <FaUser /> Entrar
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navegacao;