import { FastifyReply, FastifyRequest } from 'fastify';
import { criarPedidoDB, listarPedidosDB, atualizarPedidoDB, deletarPedidoDB } from '../models/pedidoModel';
import pool from '../database';
import { Pedido } from '../types';

export async function criarPedido(
  request: FastifyRequest<{ Body: Pedido }>, 
  reply: FastifyReply
) {
  try {
    const { id_cliente, itens } = request.body;
    const novoPedido = await criarPedidoDB(pool, id_cliente, itens);
    reply.send(novoPedido);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function listarPedidos(_: FastifyRequest, reply: FastifyReply) {
  try {
    const pedidos = await listarPedidosDB(pool);
    reply.send(pedidos);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function atualizarPedido(
  request: FastifyRequest<{ Params: { id: string }, Body: Pedido }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const { id_cliente, itens } = request.body;

    const pedidoAtualizado = await atualizarPedidoDB(pool, Number(id), id_cliente, itens);

    if (!pedidoAtualizado) {
      return reply.status(404).send({ error: 'Pedido não encontrado' });
    }

    reply.send(pedidoAtualizado);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function deletarPedido(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const deletado = await deletarPedidoDB(pool, Number(id));

    if (!deletado) {
      return reply.status(404).send({ error: 'Pedido não encontrado' });
    }

    reply.send({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}
