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

export async function listarProdutos(_: FastifyRequest, reply: FastifyReply) {
  try {
    const produtos = await listarProdutosDB(pool);
    reply.send(produtos);
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
