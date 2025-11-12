const AtendimentoService = require('../AtendimentoService');
const PedidoRepository = require('../../repositories/PedidoRepository');

// Mock do PedidoRepository
jest.mock('../../repositories/PedidoRepository');

describe('AtendimentoService', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processarAtendimento', () => {
    const sessionId = 'test-session-123';

    describe('quando o texto contém "pedido" com número válido', () => {
      it('deve retornar o status quando pedido é encontrado', () => {
        // Arrange
        const texto = 'Quero saber sobre o pedido 1001';
        const statusMock = 'Em transporte';
        PedidoRepository.getStatus.mockReturnValue(statusMock);

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado).toEqual({
          resposta: 'O status do seu pedido 1001 é **Em transporte**.',
          sessionId
        });
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(1001);
        expect(PedidoRepository.getStatus).toHaveBeenCalledTimes(1);
      });

      it('deve funcionar com texto em maiúsculas', () => {
        // Arrange
        const texto = 'PEDIDO 2000';
        const statusMock = 'Entregue';
        PedidoRepository.getStatus.mockReturnValue(statusMock);

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toContain('O status do seu pedido 2000');
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(2000);
      });

      it('deve funcionar com diferentes formatos de texto', () => {
        // Arrange
        const texto = 'Oi, gostaria de consultar o pedido número 1234';
        const statusMock = 'Processando';
        PedidoRepository.getStatus.mockReturnValue(statusMock);

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toBe('O status do seu pedido 1234 é **Processando**.');
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(1234);
      });

      it('deve capturar o primeiro número de 4 dígitos após "pedido"', () => {
        // Arrange
        const texto = 'Meu pedido 5678 está atrasado?';
        const statusMock = 'Atrasado';
        PedidoRepository.getStatus.mockReturnValue(statusMock);

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(5678);
      });
    });

    describe('quando o texto contém "pedido" mas o número não é encontrado', () => {
      it('deve retornar mensagem de pedido não encontrado', () => {
        // Arrange
        const texto = 'Cadê meu pedido 9999?';
        PedidoRepository.getStatus.mockReturnValue(null);

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado).toEqual({
          resposta: 'Não consegui encontrar o pedido com o número 9999. Por favor, verifique o número e tente novamente.',
          sessionId
        });
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(9999);
      });

      it('deve retornar mensagem de pedido não encontrado quando status é undefined', () => {
        // Arrange
        const texto = 'pedido 1111';
        PedidoRepository.getStatus.mockReturnValue(undefined);

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toContain('Não consegui encontrar o pedido com o número 1111');
      });
    });

    describe('quando o texto contém "pedido" mas sem número válido', () => {
      it('deve pedir o número do pedido quando não há números', () => {
        // Arrange
        const texto = 'Quero saber sobre meu pedido';

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado).toEqual({
          resposta: 'Entendi que você quer saber sobre um pedido, mas não identifiquei o número. Poderia me informar o número do pedido (ex: pedido 1001)?',
          sessionId
        });
        expect(PedidoRepository.getStatus).not.toHaveBeenCalled();
      });

      it('deve pedir o número quando há números com menos de 4 dígitos', () => {
        // Arrange
        const texto = 'Meu pedido 123 está onde?';

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toContain('não identifiquei o número');
        expect(PedidoRepository.getStatus).not.toHaveBeenCalled();
      });

      it('deve pedir o número quando há apenas a palavra pedido', () => {
        // Arrange
        const texto = 'pedido';

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toContain('não identifiquei o número');
      });
    });

    describe('quando o texto não contém "pedido"', () => {
      it('deve retornar mensagem padrão de boas-vindas', () => {
        // Arrange
        const texto = 'Olá, como vai?';

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado).toEqual({
          resposta: 'Olá! Como posso ajudar? Se quiser saber sobre um pedido, me diga o número dele.',
          sessionId
        });
        expect(PedidoRepository.getStatus).not.toHaveBeenCalled();
      });

      it('deve retornar mensagem padrão com texto vazio', () => {
        // Arrange
        const texto = '';

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toBe('Olá! Como posso ajudar? Se quiser saber sobre um pedido, me diga o número dele.');
      });

      it('deve retornar mensagem padrão com texto aleatório', () => {
        // Arrange
        const texto = 'Qual o horário de funcionamento?';

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toBe('Olá! Como posso ajudar? Se quiser saber sobre um pedido, me diga o número dele.');
      });
    });

    describe('validações de sessionId', () => {
      it('deve retornar o mesmo sessionId fornecido', () => {
        // Arrange
        const texto = 'Olá';
        const customSessionId = 'custom-session-456';

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, customSessionId);

        // Assert
        expect(resultado.sessionId).toBe(customSessionId);
      });

      it('deve funcionar com diferentes sessionIds', () => {
        // Arrange
        const sessionId1 = 'session-1';
        const sessionId2 = 'session-2';
        const texto = 'pedido 1000';
        PedidoRepository.getStatus.mockReturnValue('Entregue');

        // Act
        const resultado1 = AtendimentoService.processarAtendimento(texto, sessionId1);
        const resultado2 = AtendimentoService.processarAtendimento(texto, sessionId2);

        // Assert
        expect(resultado1.sessionId).toBe(sessionId1);
        expect(resultado2.sessionId).toBe(sessionId2);
      });
    });

    describe('casos extremos e edge cases', () => {
      it('deve lidar com múltiplos números no texto', () => {
        // Arrange
        const texto = 'Tenho 2 pedidos: pedido 1111 e 2222';
        PedidoRepository.getStatus.mockReturnValue('Em análise');

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        // Deve pegar o primeiro número após "pedido"
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(1111);
      });

      it('deve lidar com números de 5 dígitos (pegando apenas os 4 primeiros)', () => {
        // Arrange
        const texto = 'pedido 12345';
        PedidoRepository.getStatus.mockReturnValue('Enviado');

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(1234);
      });

      it('deve funcionar com espaços extras', () => {
        // Arrange
        const texto = '   pedido    1000   ';
        PedidoRepository.getStatus.mockReturnValue('Processando');

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(resultado.resposta).toContain('1000');
      });

      it('deve funcionar com caracteres especiais', () => {
        // Arrange
        const texto = 'Meu pedido #1000 está onde?';
        PedidoRepository.getStatus.mockReturnValue('A caminho');

        // Act
        const resultado = AtendimentoService.processarAtendimento(texto, sessionId);

        // Assert
        expect(PedidoRepository.getStatus).toHaveBeenCalledWith(1000);
      });
    });
  });
}); 