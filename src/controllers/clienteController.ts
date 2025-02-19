import { FastifyReply, FastifyRequest } from 'fastify';
import { criarClienteDB, listarClientesDB, atualizarClienteDB, deletarClienteDB } from '../models/clienteModel';
import pool from '../database';
import { Cliente } from '../types';

export async function criarCliente(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { nome, email } = request.body as Cliente;
    const novoCliente = await criarClienteDB(pool, nome, email);
    reply.send(novoCliente);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function listarClientes(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { page = '1', limit = '10' } = request.query as { page?: string; limit?: string };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));

    const { clientes, total } = await listarClientesDB(pool, pageNumber, limitNumber);

    reply.send({
      clientes,
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}


export async function atualizarCliente(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const { nome, email } = request.body as Cliente;
    
    const clienteAtualizado = await atualizarClienteDB(pool, Number(id), nome, email);
    
    if (!clienteAtualizado) {
      return reply.status(404).send({ error: 'Cliente não encontrado' });
    }

    reply.send(clienteAtualizado);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function deletarCliente(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const deletado = await deletarClienteDB(pool, Number(id));

    if (!deletado) {
      return reply.status(404).send({ error: 'Cliente não encontrado' });
    }

    reply.send({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}
