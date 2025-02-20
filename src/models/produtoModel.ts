import { Pool } from 'mysql2/promise';
import { Produto } from '../types';

export async function criarProdutoDB(pool: Pool, nome: string, preco: number): Promise<Produto> {
  const [result]: any = await pool.execute(
    'INSERT INTO produtos (nome, preco) VALUES (?, ?)', 
    [nome, preco]
  );
  return { id_produto: result.insertId, nome, preco };
}

export async function listarProdutosDB(pool: Pool, limit: number, offset: number, search: string): Promise<{ produtos: any[], total: number }> {
  const query = `SELECT * FROM produtos WHERE nome LIKE '%${search}%' LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
  const [produtos]: any = await pool.execute(query);

  const countQuery = `SELECT COUNT(*) as total FROM produtos WHERE nome LIKE '%${search}%'`;
  const [[{ total }]]: any = await pool.execute(countQuery);


  return { produtos, total };
}


export async function atualizarProdutoDB(pool: Pool, id_produto: number, nome: string, preco: number): Promise<Produto | null> {
  const [result]: any = await pool.execute(
    'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?', 
    [nome, preco, id_produto]
  );

  if (result.affectedRows === 0) {
    return null; // Produto não encontrado
  }

  return { id_produto, nome, preco };
}

export async function deletarProdutoDB(pool: Pool, id_produto: number): Promise<boolean> {
  const [result]: any = await pool.execute(
    'DELETE FROM produtos WHERE id_produto = ?', 
    [id_produto]
  );

  return result.affectedRows > 0;
}
