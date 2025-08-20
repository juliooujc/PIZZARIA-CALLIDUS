import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaQrcode, 
  FaCheckCircle, 
  FaSpinner, 
  FaHome, 
  FaExclamationTriangle,
  FaLock,
  FaShieldAlt,
  FaTruck,
  FaClock
} from 'react-icons/fa';
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

const Pagamento = ({ total, clearCarrinho }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderNumber] = useState(Math.floor(10000 + Math.random() * 90000));

  const formatCurrency = (value) => {
    return value.toFixed(2).replace('.', ',');
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = formatCardNumber(value).substring(0, 19);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!validateCardNumber(cardData.number.replace(/\s/g, ''))) {
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
      return;
    }
    
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('completed');
      clearCarrinho();
    }, 3000);
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="payment-status-container processing">
        <div className="status-content">
          <div className="status-icon-container">
            <FaSpinner className="status-icon spinner" />
          </div>
          <h2>Processando seu pagamento</h2>
          <p>Estamos confirmando suas informações...</p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">Processando...</span>
          </div>

          <div className="order-info-processing">
            <div className="info-item">
              <span className="info-label">Número do pedido:</span>
              <span className="info-value">#{orderNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Valor total:</span>
              <span className="info-value">R$ {formatCurrency(total)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Método:</span>
              <span className="info-value">{getPaymentMethodName(paymentMethod)}</span>
            </div>
          </div>

          <div className="security-message">
            <FaLock /> Transação segura em andamento
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="payment-status-container success">
        <div className="status-content">
          <div className="status-icon-container">
            <FaCheckCircle className="status-icon success" />
          </div>
          <h2>Pagamento concluído com sucesso!</h2>
          <p className="success-message">Seu pedido já está sendo preparado com carinho</p>
          
          <div className="order-details-success">
            <div className="detail-card">
              <h3>📦 Detalhes do Pedido</h3>
              <div className="detail-item">
                <span>Número do pedido:</span>
                <strong>#{orderNumber}</strong>
              </div>
              <div className="detail-item">
                <span>Valor total:</span>
                <strong>R$ {formatCurrency(total)}</strong>
              </div>
              <div className="detail-item">
                <span>Método de pagamento:</span>
                <strong>{getPaymentMethodName(paymentMethod)}</strong>
              </div>
              <div className="detail-item">
                <span>Status:</span>
                <span className="status-badge confirmed">Confirmado</span>
              </div>
            </div>

            <div className="delivery-info">
              <FaTruck className="delivery-icon" />
              <p>Seu pedido chegará em aproximadamente 45-60 minutos</p>
            </div>
          </div>

          <button 
            className="back-to-menu-btn"
            onClick={handleBackToMenu}
          >
            <FaHome /> Voltar ao Cardápio
          </button>

          <div className="thank-you-message">
            <p>Obrigado por escolher a Pizzaria Callidus! 🍕</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Finalizar Compra</h1>
        <div className="payment-total">
          <span>Total a pagar:</span>
          <span className="total-amount">R$ {formatCurrency(total)}</span>
        </div>
      </div>

      <div className="payment-content">
        {/* Security Badges */}
        <div className="security-badges">
          <div className="security-item">
            <FaLock />
            <span>Pagamento seguro</span>
          </div>
          <div className="security-item">
            <FaShieldAlt />
            <span>Dados criptografados</span>
          </div>
          <div className="security-item">
            <FaClock />
            <span>Processamento rápido</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods-section">
          <h2>Escolha como pagar</h2>
          
          <div className="payment-methods-grid">
            <div 
              className={`payment-method-card ${paymentMethod === 'credit' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('credit')}
            >
              <div className="method-icon">
                <FaCreditCard />
              </div>
              <div className="method-info">
                <h3>Cartão de Crédito</h3>
                <p>Parcelamento em até 12x</p>
              </div>
              <div className="method-check"></div>
            </div>

            <div 
              className={`payment-method-card ${paymentMethod === 'debit' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('debit')}
            >
              <div className="method-icon">
                <FaMoneyBillWave />
              </div>
              <div className="method-info">
                <h3>Cartão de Débito</h3>
                <p>Pagamento à vista</p>
              </div>
              <div className="method-check"></div>
            </div>

            <div 
              className={`payment-method-card ${paymentMethod === 'pix' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('pix')}
            >
              <div className="method-icon">
                <FaQrcode />
              </div>
              <div className="method-info">
                <h3>PIX</h3>
                <p>Pagamento instantâneo</p>
              </div>
              <div className="method-check"></div>
            </div>
          </div>
        </div>

        {/* Card Form */}
        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
          <div className="card-form-section">
            <h3>Dados do Cartão</h3>
            
            <div className="card-form">
              <div className="form-group">
                <label>Número do Cartão</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  name="number"
                  value={cardData.number}
                  onChange={handleInputChange}
                  className={`form-input ${errors.number ? 'error' : ''}`}
                  maxLength="19"
                />
                {errors.number && (
                  <div className="error-message">
                    <FaExclamationTriangle /> {errors.number}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Nome no Cartão</label>
                <input
                  type="text"
                  placeholder="Como está no cartão"
                  name="name"
                  value={cardData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && (
                  <div className="error-message">
                    <FaExclamationTriangle /> {errors.name}
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleInputChange}
                    className={`form-input small ${errors.expiry ? 'error' : ''}`}
                    maxLength="5"
                  />
                  {errors.expiry && (
                    <div className="error-message">
                      <FaExclamationTriangle /> {errors.expiry}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleInputChange}
                    className={`form-input small ${errors.cvv ? 'error' : ''}`}
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

        {/* PIX Section */}
        {paymentMethod === 'pix' && (
          <div className="pix-section">
            <h3>Pagamento via PIX</h3>
            
            <div className="pix-container">
              <div className="pix-qr-code">
                <FaQrcode className="pix-icon" />
                <div className="pix-amount">
                  <span>Valor: R$ {formatCurrency(total)}</span>
                </div>
              </div>
              
              <div className="pix-instructions">
                <h4>Como pagar:</h4>
                <ol>
                  <li>Abra o app do seu banco</li>
                  <li>Escaneie o código QR acima</li>
                  <li>Confirme o pagamento</li>
                  <li>Pronto! Seu pedido será liberado</li>
                </ol>
              </div>

              <div className="pix-info">
                <p>⏰ Código válido por 30 minutos</p>
                <p>✅ Pagamento instantâneo</p>
                <p>🎉 5% de desconto no PIX</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          className="payment-submit-btn"
          onClick={handleSubmit}
        >
          {paymentMethod === 'pix' ? 'Já efetuei o pagamento PIX' : 'Finalizar Pagamento'}
        </button>

        {/* Additional Security */}
        <div className="additional-security">
          <FaShieldAlt className="security-shield" />
          <p>Seus dados estão protegidos com criptografia de ponta</p>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;