import { FastifyReply, FastifyRequest } from 'fastify';
import { criarProdutoDB, listarProdutosDB, atualizarProdutoDB, deletarProdutoDB } from '../models/produtoModel';
import pool from '../database';
import { Produto } from '../types';

export async function criarProduto(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { nome, preco } = request.body as Produto;
    const novoProduto = await criarProdutoDB(pool, nome, preco);
    reply.send(novoProduto);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function listarProdutos(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { page = "1", limit = "10" } = request.query as { page?: string; limit?: string };
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const { produtos, total } = await listarProdutosDB(pool, limitNumber, offset);

    reply.send({
      produtos,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function atualizarProduto(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const { nome, preco } = request.body as Produto;
    
    const produtoAtualizado = await atualizarProdutoDB(pool, Number(id), nome, preco);
    
    if (!produtoAtualizado) {
      return reply.status(404).send({ error: 'Produto não encontrado' });
    }

    reply.send(produtoAtualizado);
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}

export async function deletarProduto(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const deletado = await deletarProdutoDB(pool, Number(id));

    if (!deletado) {
      return reply.status(404).send({ error: 'Produto não encontrado' });
    }

    reply.send({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    reply.status(500).send({ error: (error as Error).message });
  }
}
