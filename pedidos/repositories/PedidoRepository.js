const { pedidosData } = require('../data/pedidosData');

/**
 * @class PedidoRepository
 * @description Simula a interação com o banco de dados, por enquanto em memória. 
 */

class PedidoRepository {
    /**
     * @method findById
     * @param {string} id - o ID do pedido a ser buscado
     * @returns {object|undefined} - O objeto Pedido se encontrado, ou undefined. 
     * 
     */
    static findById(id){
        // static define um método que pertence à própria classe e não uma instância(objeto)
        // método find para buscar um ID específico do array 'pedidosData
        // Consultar o status do pedido por ID.
        // A variável importada é `pedidosData`, então devemos usá-la.
        const pedido = pedidosData.find(p => p.id === id);
        return pedido; // retorna o que foi encontrado
    }
    /**
     * @method getStatus
     * @param {string} id - O ID do pedido.
     * @returns {string|null} - O status do pedido ou null se não encontrado
     */
    static getStatus(id){
        // Dentro de um método estático, é mais seguro chamar outro método estático
        // usando o nome da classe para evitar problemas de contexto com 'this'.
        const pedido = PedidoRepository.findById(id);
        return pedido ? pedido.status : null;
    }
}

module.exports = PedidoRepository; 