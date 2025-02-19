import { FastifyInstance } from 'fastify';
import { criarProduto, listarProdutos, atualizarProduto, deletarProduto } from '../controllers/produtoController';

export default async function produtoRoutes(fastify: FastifyInstance) {
  fastify.post('/produtos', criarProduto);
  fastify.get('/produtos', listarProdutos);
  fastify.put('/produtos/:id', atualizarProduto);
  fastify.delete('/produtos/:id', deletarProduto);
}
