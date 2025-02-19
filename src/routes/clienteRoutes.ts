import { FastifyInstance } from 'fastify';
import { criarCliente, listarClientes, atualizarCliente, deletarCliente } from '../controllers/clienteController';

export default async function clienteRoutes(fastify: FastifyInstance) {
  fastify.post('/clientes', criarCliente);
  fastify.get('/clientes', listarClientes);
  fastify.put('/clientes/:id', atualizarCliente);
  fastify.delete('/clientes/:id', deletarCliente);
}
