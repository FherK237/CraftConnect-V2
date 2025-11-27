function getContractHtml(contractData, fixerName, clientName) {
    
    // Calcula la ganancia neta y la comisión (asumiendo que la tasa de comisión se aplica al precio total)
    const commissionRate = contractData.Comission.commission_rate || 0.15; // Usamos 0.15 si no se cargó
    const totalPrice = parseFloat(contractData.price || 0);
    const commissionAmount = parseFloat(contractData.Comission.commission || 0); // Tomamos la comisión ya calculada
    const fixerEarning = (totalPrice - commissionAmount).toFixed(2);
    
    const formattedDate = new Date(contractData.start_datetime).toLocaleDateString('es-ES', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Contrato CrafterConnect #${contractData.id}</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; font-size: 11pt; color: #333; }
                .container { width: 100%; max-width: 750px; margin: 0 auto; padding: 30px; }
                .header { text-align: center; margin-bottom: 40px; padding: 15px; background-color: #f0f8ff; border-bottom: 3px solid #007bff; }
                h1 { margin: 0; color: #007bff; font-size: 20pt; }
                .section { margin-bottom: 25px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .section h2 { font-size: 14pt; color: #555; margin-bottom: 10px; }
                .data-row { display: table; width: 100%; margin-bottom: 8px; }
                .data-label, .data-value { display: table-cell; padding-right: 15px; }
                .data-label { font-weight: 600; width: 35%; color: #666; }
                .data-value { font-weight: normal; color: #000; }
                
                /* Estilos Financieros */
                .financial-box { border: 2px solid #28a745; padding: 15px; margin-top: 20px; border-radius: 5px; }
                .total-price { font-size: 16pt; font-weight: bold; color: #28a745; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>CONTRATO DE SERVICIO — CrafterConnect</h1>
                    <p style="font-size: 10pt; color: #555;">Documento de Contrato # ${contractData.id}</p>
                </div>

                <div class="section">
                    <h2>INFORMACIÓN GENERAL</h2>
                    <div class="data-row">
                        <span class="data-label">Estado Actual:</span>
                        <span class="data-value" style="font-weight: bold; color: ${contractData.status === 'confirmed' ? '#007bff' : '#ffc107'};">
                            ${contractData.status.toUpperCase()}
                        </span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Fecha de Inicio Agendada:</span>
                        <span class="data-value">${formattedDate}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Fecha de Creación:</span>
                        <span class="data-value">${new Date(contractData.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                </div>

                <div class="section">
                    <h2>PARTES</h2>
                    <div class="data-row">
                        <span class="data-label">Cliente (Contratante):</span>
                        <span class="data-value">${clientName}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Fixer (Profesional):</span>
                        <span class="data-value">${fixerName}</span>
                    </div>
                </div>

                <div class="financial-box">
                    <h2>RESUMEN FINANCIERO</h2>
                    <div class="data-row">
                        <span class="data-label">Precio Total Acordado (Cliente Paga):</span>
                        <span class="total-price">$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Comisión de CrafterConnect (15%):</span>
                        <span class="data-value">$${commissionAmount.toFixed(2)}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Ganancia Neta Estimada del Fixer:</span>
                        <span class="data-value">$${fixerEarning}</span>
                    </div>
                </div>
                
                <div style="margin-top: 50px; text-align: center; font-size: 10pt; color: #888;">
                    <p>Este contrato es una propuesta de servicio. Al confirmar, el cliente acepta los términos financieros.</p>
                    <p>Documento generado en ${new Date().toLocaleDateString('es-ES')}.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

module.exports = getContractHtml;