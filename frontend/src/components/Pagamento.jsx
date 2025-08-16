import { useState } from 'react';
import { FaCreditCard, FaMoneyBillWave, FaQrcode, FaCheckCircle, FaSpinner, FaHome, FaExclamationTriangle } from 'react-icons/fa';
import './Pagamento.css';

const validateCardNumber = (number) => /^\d{16}$/.test(number);
const validateCardName = (name) => name.trim().length >= 3;
const validateExpiry = (expiry) => /^\d{2}\/\d{2}$/.test(expiry);
const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

const getPaymentMethodName = (method) => {
  switch(method) {
    case 'credit': return 'Cartão de Crédito';
    case 'debit': return 'Cartão de Débito';
    case 'pix': return 'PIX';
    default: return '';
  }
};

const Pagamento = ({ total }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderNumber] = useState(Math.floor(Math.random() * 10000));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!validateCardNumber(cardData.number)) {
        newErrors.number = 'Número do cartão inválido (16 dígitos)';
      }
      if (!validateCardName(cardData.name)) {
        newErrors.name = 'Nome no cartão deve ter pelo menos 3 caracteres';
      }
      if (!validateExpiry(cardData.expiry)) {
        newErrors.expiry = 'Formato inválido (MM/AA)';
      }
      if (!validateCVV(cardData.cvv)) {
        newErrors.cvv = 'CVV inválido (3 ou 4 dígitos)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Não prossegue se houver erros
    }
    
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('completed');
    }, 2000);
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="payment-status-container processing">
        <div className="status-content">
          <FaSpinner className="status-icon spinner" />
          <h2>Pagamento em processamento</h2>
          <p>Aguarde enquanto processamos seu pagamento...</p>
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <div className="order-info">
            <p>Valor: R$ {total.toFixed(2)}</p>
            <p>Método: {getPaymentMethodName(paymentMethod)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="payment-status-container success">
        <div className="status-content">
          <FaCheckCircle className="status-icon success" />
          <h2>Pagamento concluído!</h2>
          <p className="success-message">Seu pedido está sendo preparado.</p>
          <div className="order-details">
            <p><strong>Número do pedido:</strong> #{orderNumber}</p>
            <p><strong>Valor total:</strong> R$ {total.toFixed(2)}</p>
            <p><strong>Método de pagamento:</strong> {getPaymentMethodName(paymentMethod)}</p>
          </div>
          <button 
            className="back-to-menu"
            onClick={() => window.location.href = '/'}
          >
            <FaHome /> Voltar ao cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h2>Finalizar Compra</h2>
      <p className="payment-total">Total: R$ {total.toFixed(2)}</p>
      
      <h3 className="payment-methods-title">Método de Pagamento</h3>
      
      <div 
        className={`payment-method ${paymentMethod === 'credit' ? 'active' : ''}`}
        onClick={() => setPaymentMethod('credit')}
      >
        <FaCreditCard className="payment-icon" />
        <div>
          <h4>Cartão de Crédito</h4>
          <p>Pgamento à vista</p>
        </div>
      </div>
      
      <div 
        className={`payment-method ${paymentMethod === 'debit' ? 'active' : ''}`}
        onClick={() => setPaymentMethod('debit')}
      >
        <FaMoneyBillWave className="payment-icon" />
        <div>
          <h4>Cartão de Débito</h4>
          <p>Pagamento à vista</p>
        </div>
      </div>
      
      <div 
        className={`payment-method ${paymentMethod === 'pix' ? 'active' : ''}`}
        onClick={() => setPaymentMethod('pix')}
      >
        <FaQrcode className="payment-icon" />
        <div>
          <h4>PIX</h4>
          <p>Pagamento instantâneo</p>
        </div>
      </div>
      
      {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
        <div className="card-data-container">
          <h4>Dados do Cartão</h4>
          <div className="card-inputs">
            <div className="input-group">
              <input
                type="text"
                placeholder="Número do Cartão (16 dígitos)"
                name="number"
                value={cardData.number}
                onChange={handleInputChange}
                className={`card-input ${errors.number ? 'error' : ''}`}
                maxLength="16"
              />
              {errors.number && (
                <div className="error-message">
                  <FaExclamationTriangle /> {errors.number}
                </div>
              )}
            </div>
            
            <div className="input-group">
              <input
                type="text"
                placeholder="Nome no Cartão"
                name="name"
                value={cardData.name}
                onChange={handleInputChange}
                className={`card-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && (
                <div className="error-message">
                  <FaExclamationTriangle /> {errors.name}
                </div>
              )}
            </div>
            
            <div className="card-group">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Validade (MM/AA)"
                  name="expiry"
                  value={cardData.expiry}
                  onChange={handleInputChange}
                  className={`card-input small ${errors.expiry ? 'error' : ''}`}
                  maxLength="5"
                />
                {errors.expiry && (
                  <div className="error-message">
                    <FaExclamationTriangle /> {errors.expiry}
                  </div>
                )}
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="CVV"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleInputChange}
                  className={`card-input small ${errors.cvv ? 'error' : ''}`}
                  maxLength="4"
                />
                {errors.cvv && (
                  <div className="error-message">
                    <FaExclamationTriangle /> {errors.cvv}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {paymentMethod === 'pix' && (
        <div className="pix-container">
          <h4>Pague com PIX</h4>
          <div className="pix-qrcode">
            <FaQrcode className="pix-icon" />
            <p>Chave PIX: 123.456.789-09</p>
            <p>Valor: R$ {total.toFixed(2)}</p>
          </div>
          <p className="pix-expiry">O código PIX expira em 30 minutos</p>
        </div>
      )}
      
      <button 
        className="payment-submit"
        onClick={handleSubmit}
      >
        {paymentMethod === 'pix' ? 'Verificar' : 'Finalizar Pagamento'}
      </button>
    </div>
  );
};

export default Pagamento;