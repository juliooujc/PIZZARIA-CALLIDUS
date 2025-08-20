import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaMotorcycle, FaUtensils, FaClock, FaMapMarkerAlt, FaList, FaHome, FaMugHot } from 'react-icons/fa';
import './Entregas.css';

// Componente para exibir os detalhes de um pedido pronto
const PedidoProntoCard = ({ pedido, onMarcarEntregue, loading }) => {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const formatarData = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const calcularTempoEspera = (timestamp) => {
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
    <div className={`pedido-pronto-card ${pedido.tipoEntrega === 'delivery' ? 'delivery' : 'mesa'}`}>
      <div className="pedido-pronto-header">
        <div className="pedido-pronto-info">
          <h3 className="pedido-pronto-id">Pedido #{pedido.id?.substring(0, 8) || 'N/A'}</h3>
          <span className="pedido-pronto-tempo">
            <FaClock /> Esperando: {calcularTempoEspera(pedido.timestamp)}
          </span>
          <span className="pedido-pronto-data">{formatarData(pedido.timestamp)}</span>
        </div>
        
        <div className="pedido-pronto-tipo">
          {pedido.tipoEntrega === 'mesa' ? (
            <span className="tipo-mesa">
              <FaMugHot /> Mesa {pedido.mesa}
            </span>
          ) : (
            <span className="tipo-delivery">
              <FaMotorcycle /> Delivery
            </span>
          )}
        </div>
      </div>

      <div className="pedido-pronto-resumo">
        <span className="total-pedido">
          Total: R$ {pedido.total?.toFixed(2).replace('.', ',')}
        </span>
        <span className="itens-count">
          {pedido.itens?.length || 0} item{pedido.itens?.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="pedido-pronto-actions">
        <button
          onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
          className="detalhes-btn"
        >
          <FaList /> {mostrarDetalhes ? 'Ocultar' : 'Ver'} Detalhes
        </button>
        
        <button
          onClick={() => onMarcarEntregue(pedido.id)}
          className="entregue-btn"
          disabled={loading}
        >
          {pedido.tipoEntrega === 'delivery' ? (
            <>
              <FaMotorcycle /> Entregue
            </>
          ) : (
            <>
              <FaUtensils /> Servido
            </>
          )}
        </button>
      </div>

      {mostrarDetalhes && (
        <div className="pedido-pronto-detalhes">
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

const Entregas = () => {
  const [pedidosProntos, setPedidosProntos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'mesa', 'delivery'

  // Carregar pedidos prontos do localStorage
  useEffect(() => {
    const carregarPedidosProntos = () => {
        // Lê da chave correta
        const pedidosSalvos = JSON.parse(localStorage.getItem('pedidosProntos') || '[]');
        setPedidosProntos(pedidosSalvos);
    };

    carregarPedidosProntos();
    
    // Atualizar a cada 5 segundos para pegar mudanças em tempo real
    const interval = setInterval(carregarPedidosProntos, 5000);
    
    return () => clearInterval(interval);
    }, []);

  const handleMarcarEntregue = async (pedidoId) => {
    setLoading(true);
    
    try {
      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove o pedido da lista de prontos
      const pedidosAtualizados = pedidosProntos.filter(pedido => pedido.id !== pedidoId);
      setPedidosProntos(pedidosAtualizados);
      
      // Salva no localStorage (simulação)
      localStorage.setItem('pedidosProntos', JSON.stringify(pedidosAtualizados));
      
      // Aqui você poderia enviar para histórico ou banco de dados
      console.log(`Pedido ${pedidoId} marcado como entregue/servido`);
      
    } catch (error) {
      console.error('Erro ao marcar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const pedidosFiltrados = pedidosProntos.filter(pedido => {
    if (filtro === 'todos') return true;
    return pedido.tipoEntrega === filtro;
  });

  const pedidosMesa = pedidosProntos.filter(pedido => pedido.tipoEntrega === 'mesa').length;
  const pedidosDelivery = pedidosProntos.filter(pedido => pedido.tipoEntrega === 'delivery').length;

  return (
    <div className="entregas-container">
      {/* Header */}
      <div className="entregas-header">
        <h1 className="entregas-title">
          <FaMotorcycle /> Área de Entregas
        </h1>
        
        <div className="entregas-stats">
          <div className="stat-item">
            <span className="stat-number">{pedidosProntos.length}</span>
            <span className="stat-label">Pedidos Prontos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{pedidosMesa}</span>
            <span className="stat-label">Para Servir</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{pedidosDelivery}</span>
            <span className="stat-label">Para Entregar</span>
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
            <FaMugHot /> Para Servir
          </button>
          <button
            className={`filtro-btn ${filtro === 'delivery' ? 'active' : ''}`}
            onClick={() => setFiltro('delivery')}
          >
            <FaMotorcycle /> Para Entregar
          </button>
        </div>
      </div>

      {/* Lista de Pedidos Prontos */}
      <div className="pedidos-prontos-lista">
        {pedidosFiltrados.length === 0 ? (
          <div className="empty-entregas">
            <div className="empty-entregas-content">
              <FaCheckCircle className="empty-entregas-icon" />
              <h2>Nenhum pedido pronto para entrega</h2>
              <p>Todos os pedidos foram entregues ou não há pedidos prontos</p>
            </div>
          </div>
        ) : (
          <div className="pedidos-prontos-grid">
            {pedidosFiltrados.map((pedido) => (
              <PedidoProntoCard
                key={pedido.id}
                pedido={pedido}
                onMarcarEntregue={handleMarcarEntregue}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer com resumo */}
      <div className="entregas-footer">
        <div className="resumo-entregas">
          <h4>Resumo das Entregas</h4>
          <div className="resumo-stats">
            <span>Pedidos aguardando: {pedidosProntos.length}</span>
            <span>Tempo médio de espera: 15min</span>
            <span>Entregas hoje: 12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entregas;