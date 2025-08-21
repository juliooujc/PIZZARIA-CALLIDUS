import React, { useState, useEffect } from 'react';
import { FaUtensils, FaCheckCircle, FaClock, FaMapMarkerAlt, FaList, FaHome, FaMugHot } from 'react-icons/fa';
import './Cozinha.css';

// Componente para exibir os detalhes de um pedido
const PedidoCard = ({ pedido, onMarcarPronto, loading }) => {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const formatarData = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const calcularTempoDecorrido = (timestamp) => {
    const agora = new Date();
    const pedidoTime = new Date(timestamp);
    const diffMs = agora - pedidoTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}min`;
    }
    return `${diffMins}min`;
  };

  return (
    <div className="pedido-card">
      <div className="pedido-header">
        <div className="pedido-info">
          <h3 className="pedido-id">Pedido #{pedido.id?.substring(0, 8) || 'N/A'}</h3>
          <span className="pedido-tempo">
            <FaClock /> {calcularTempoDecorrido(pedido.timestamp)}
          </span>
          <span className="pedido-data">{formatarData(pedido.timestamp)}</span>
        </div>
        
        <div className="pedido-tipo">
          {pedido.tipoEntrega === 'mesa' ? (
            <span className="tipo-mesa">
              <FaMugHot /> Mesa {pedido.mesa}
            </span>
          ) : (
            <span className="tipo-delivery">
              <FaHome /> Delivery
            </span>
          )}
        </div>
      </div>

      <div className="pedido-resumo">
        <span className="total-pedido">
          Total: R$ {pedido.total?.toFixed(2).replace('.', ',')}
        </span>
        <span className="itens-count">
          {pedido.itens?.length || 0} item{pedido.itens?.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="pedido-actions">
        <button
          onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
          className="detalhes-btn"
        >
          <FaList /> {mostrarDetalhes ? 'Ocultar' : 'Ver'} Detalhes
        </button>
        
        <button
          onClick={() => onMarcarPronto(pedido.id)}
          className="pronto-btn"
          disabled={loading}
        >
          <FaCheckCircle /> Pedido Pronto
        </button>
      </div>

      {mostrarDetalhes && (
        <div className="pedido-detalhes">
          <h4>Itens do Pedido:</h4>
          <div className="itens-lista">
            {pedido.itens?.map((item, index) => (
              <div key={index} className="item-detalhe">
                <span className="item-quantity">{item.quantity}x</span>
                <span className="item-nome">{item.nome}</span>
                <span className="item-subtotal">
                  R$ {((item.preco || 0) * (item.quantity || 1)).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>

          {pedido.tipoEntrega === 'delivery' && pedido.endereco && (
            <div className="endereco-entrega">
              <h4>
                <FaMapMarkerAlt /> Endereço de Entrega:
              </h4>
              <p>
                {pedido.endereco.rua}, {pedido.endereco.numero}<br />
                {pedido.endereco.bairro}<br />
                {pedido.endereco.complemento && `Complemento: ${pedido.endereco.complemento}`}
              </p>
            </div>
          )}

          {pedido.tipoEntrega === 'mesa' && (
            <div className="mesa-info">
              <h4>
                <FaMugHot /> Mesa:
              </h4>
              <p>Número {pedido.mesa}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Cozinha = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'mesa', 'delivery'

  // Simulação de dados - na implementação real, isso viria de uma API
  useEffect(() => {
    const carregarPedidos = () => {
      // Recupera pedidos do localStorage (simulação)
      const pedidosSalvos = JSON.parse(localStorage.getItem('pedidosCozinha') || '[]');
      setPedidos(pedidosSalvos);
    };

    carregarPedidos();
    
    // Atualiza a cada 30 segundos (simulação de atualização em tempo real)
    const interval = setInterval(carregarPedidos, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMarcarPronto = async (pedidoId) => {
    setLoading(true);
    
    try {
        // Encontra o pedido na lista atual
        const pedido = pedidos.find(p => p.id === pedidoId);
        
        if (pedido) {
        // Remove da lista da cozinha
        const pedidosCozinhaAtualizados = pedidos.filter(p => p.id !== pedidoId);
        setPedidos(pedidosCozinhaAtualizados);
        
        // Salva a lista atualizada da cozinha
        localStorage.setItem('pedidosCozinha', JSON.stringify(pedidosCozinhaAtualizados));
        
        // Adiciona à lista de entregas (pedidos prontos)
        const pedidosProntosExistentes = JSON.parse(localStorage.getItem('pedidosProntos') || '[]');
        const pedidoPronto = { 
            ...pedido, 
            status: 'pronto',
            timestampPronto: new Date().toISOString() // Adiciona timestamp de quando ficou pronto
        };
        
        const novosPedidosProntos = [...pedidosProntosExistentes, pedidoPronto];
        localStorage.setItem('pedidosProntos', JSON.stringify(novosPedidosProntos));
        
        console.log('Pedido movido para entregas:', pedidoPronto);
        }
        
    } catch (error) {
        console.error('Erro ao marcar pedido como pronto:', error);
        alert('Erro ao processar pedido. Tente novamente.');
    } finally {
        setLoading(false);
    }
    };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtro === 'todos') return true;
    return pedido.tipoEntrega === filtro;
  });

  const pedidosMesa = pedidos.filter(pedido => pedido.tipoEntrega === 'mesa').length;
  const pedidosDelivery = pedidos.filter(pedido => pedido.tipoEntrega === 'delivery').length;

  return (
    <div className="cozinha-container">
      {/* Header */}
      <div className="cozinha-header">
        <h1 className="cozinha-title">
          <FaUtensils /> Área da Cozinha
        </h1>
        
        <div className="cozinha-stats">
          <div className="stat-item">
            <span className="stat-number">{pedidos.length}</span>
            <span className="stat-label">Total Pedidos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{pedidosMesa}</span>
            <span className="stat-label">Mesas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{pedidosDelivery}</span>
            <span className="stat-label">Delivery</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-section">
        <h3>Filtrar por:</h3>
        <div className="filtro-options">
          <button
            className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos os Pedidos
          </button>
          <button
            className={`filtro-btn ${filtro === 'mesa' ? 'active' : ''}`}
            onClick={() => setFiltro('mesa')}
          >
            <FaMugHot /> Mesas
          </button>
          <button
            className={`filtro-btn ${filtro === 'delivery' ? 'active' : ''}`}
            onClick={() => setFiltro('delivery')}
          >
            <FaHome /> Delivery
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="pedidos-lista">
        {pedidosFiltrados.length === 0 ? (
          <div className="empty-cozinha">
            <div className="empty-cozinha-content">
              <FaUtensils className="empty-cozinha-icon" />
              <h2>Nenhum pedido em preparação</h2>
              <p>Todos os pedidos estão prontos ou não há pedidos pendentes</p>
            </div>
          </div>
        ) : (
          <div className="pedidos-grid">
            {pedidosFiltrados.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                onMarcarPronto={handleMarcarPronto}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer com resumo */}
      <div className="cozinha-footer">
        <div className="resumo-cozinha">
          <h4>Resumo da Produção</h4>
          <div className="resumo-stats">
            <span>Pedidos em andamento: {pedidos.length}</span>
            <span>Preparo médio: 25min</span>
            <span>Capacidade: {Math.round((pedidos.length / 10) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cozinha;