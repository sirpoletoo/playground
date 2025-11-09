const AtendimentoService = require('../services/AtendimentoService');

class AtendimentoController {
    static executarAtendimento(req, res){
        console.log('=== INÍCIO DO PROCESSAMENTO ===');
        console.log('1. req.body recebido:', req.body);
        console.log('2. AtendimentoService:', AtendimentoService);
        console.log('3. Tipo de AtendimentoService:', typeof AtendimentoService);
        
        const {texto, sessionId} = req.body;
        
        if(!texto){
            console.log('4. ERRO: Texto não fornecido');
            return res.status(400).json({ erro: 'O campo "texto" é obrigatório.'});
        }
        
        console.log('5. Texto recebido:', texto);
        const initialSessionId = sessionId || 'nova_sessao_' + Date.now();
        console.log('6. SessionId:', initialSessionId);
        
        try {
            console.log('7. Antes de chamar processarAtendimento');
            console.log('8. Método existe?', typeof AtendimentoService.processarAtendimento);
            
            const resultado = AtendimentoService.processarAtendimento(texto, initialSessionId);
            
            console.log('9. Resultado obtido:', resultado);
            
            res.json({
                sessionId: resultado.sessionId,
                resposta: resultado.resposta
            });
            
            console.log('10. Resposta enviada com sucesso');
        } catch (error){
            console.error('=== ERRO CAPTURADO ===');
            console.error('Mensagem:', error.message);
            console.error('Stack completo:', error.stack);
            console.error('Nome do erro:', error.name);
            console.error('===================');
            
            res.status(500).json({ erro: 'Ocorreu um erro interno no processamento'});
        }
    }
}

module.exports = AtendimentoController;