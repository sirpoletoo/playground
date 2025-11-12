const PedidoRepository = require('../repositories/PedidoRepository');

/**
 * @class AtendimentoService
 * @description Implementa a lógica de negócios para processar as requisições de atendimento
 */

class AtendimentoService {
    /** 
     * @method processarAtendimento
     * @param {string} texto - O texto fornecido pelo usuário
     * @param {string} sessionId - Um ID para rastrear a sessão
     * @returns {object} - Um objeto contendo a resposta e o sessionId.
     * 
     */
    static processarAtendimento(texto, sessionId){
        // 1. Criar sessionId (já existe o simulado)
        // 2. Ler o texto (o 'texto' é o input)
        const textoLowerCase = texto.toLowerCase();

        // 3. Teste de condição para 'Texto contém informação do pedido' e 'Texto contém "pedido"'
        if (textoLowerCase.includes('pedido')){
            //4. Teste condição: 'Verificar se contém número do pedido: "1000"'
            const regex = /pedido.*?(\d{4})/;
            const match = textoLowerCase.match(regex);
            // expressão regular usada para encontrar combinações de caracteres em strings.
            if (match && match[1]) {
                const pedidoIdString = match[1];
                const pedidoIdNumerico = parseInt(pedidoIdString, 10);
                const status = PedidoRepository.getStatus(pedidoIdNumerico);
 
                if (status) {
                    // Pedido e status encontrados
                    const resposta = `O status do seu pedido ${pedidoIdString} é **${status}**.`;
                    return { resposta, sessionId };
                } else {
                    // ID do pedido mencionado, mas não encontrado
                    const resposta = `Não consegui encontrar o pedido com o número ${pedidoIdString}. Por favor, verifique o número e tente novamente.`;
                    return { resposta, sessionId };
                }
            } else {
                // Palavra "pedido" mencionada, mas sem um número válido
                const resposta = "Entendi que você quer saber sobre um pedido, mas não identifiquei o número. Poderia me informar o número do pedido (ex: pedido 1001)?";
                return { resposta, sessionId };
            }
        }
        // Resposta padrão se a palavra "pedido" não for encontrada
                const resposta = "Olá! Como posso ajudar? Se quiser saber sobre um pedido, me diga o número dele. (ex: pedido 1001)";
                return { resposta, sessionId };
            }
        }
        
        module.exports = AtendimentoService;