// Navegacao.js
import React from "react";
import { NavLink } from "react-router-dom";

const linkCorrente =({isActive}) => ({
  color:isActive ? "#027399" : "inherit",
  fontWeight: isActive ? "bold" : "normal",
});

const Navegacao = () => (
  <nav aria-label="Navegação principal">
    <ul style={{
      listStyle: "none",
      padding:0,
      display: "flex",
      gap: "1rem",
      margin: 0
    }}>
      <li>
        <NavLink
          to='/'
          style={linkCorrente}
          end
          aria-current='page'
        >
          Cardápio
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/notfound'
          style={linkCorrente}          
        >
          NotFound
        </NavLink>
      </li>
    </ul>
  </nav>
);


export default Navegacao;