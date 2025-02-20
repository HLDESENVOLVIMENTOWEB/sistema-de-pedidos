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

    // Verifica se id_cliente é um número válido
    if (!Number.isInteger(id_cliente)) {
      return reply.status(400).send({ error: "id_cliente deve ser um número inteiro válido." });
    }

    // Verifica se todos os itens têm um id_produto válido
    for (const item of itens) {
      if (!Number.isInteger(item.id_produto) || item.qtde <= 0 || item.preco < 0) {
        return reply.status(400).send({ error: "Cada item deve ter id_produto, qtde e preco válidos." });
      }
    }

    const novoPedido = await criarPedidoDB(pool, id_cliente, itens);
    reply.send(novoPedido);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}


export async function listarPedidos(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { page = "1", limit = "10" } = request.query as { page?: string; limit?: string };
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const { pedidos, total } = await listarPedidosDB(pool, limitNumber, offset);

    reply.send({
      pedidos,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
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
