import { FastifyInstance } from 'fastify';
import { criarPedido, listarPedidos, atualizarPedido, deletarPedido } from '../controllers/pedidoController';

export default async function pedidoRoutes(fastify: FastifyInstance) {
  fastify.post('/pedidos', criarPedido);
  fastify.get('/pedidos', listarPedidos);
  fastify.put('/pedidos/:id', atualizarPedido);
  fastify.delete('/pedidos/:id', deletarPedido);
}
