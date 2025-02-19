import { Pool } from 'mysql2/promise';
import { Cliente } from '../types';

export async function criarClienteDB(pool: Pool, nome: string, email: string): Promise<Cliente> {
  const [result]: any = await pool.execute(
    'INSERT INTO clientes (nome, email) VALUES (?, ?)', 
    [nome, email]
  );
  return { id_cliente: result.insertId, nome, email };
}

export async function listarClientesDB(pool: Pool, page: number, limit: number): Promise<{ clientes: Cliente[]; total: number }> {
  const offset = (page - 1) * limit;

  const [rows]: any = await pool.execute('SELECT * FROM clientes LIMIT ? OFFSET ?', [limit, offset]);

  const [[{ total }]]: any = await pool.execute('SELECT COUNT(*) AS total FROM clientes');

  return { clientes: rows, total };
}

export async function atualizarClienteDB(pool: Pool, id_cliente: number, nome: string, email: string): Promise<Cliente | null> {
  const [result]: any = await pool.execute(
    'UPDATE clientes SET nome = ?, email = ? WHERE id_cliente = ?', 
    [nome, email, id_cliente]
  );

  if (result.affectedRows === 0) {
    return null; // Cliente não encontrado
  }

  return { id_cliente, nome, email };
}

export async function deletarClienteDB(pool: Pool, id_cliente: number): Promise<boolean> {
  const [result]: any = await pool.execute(
    'DELETE FROM clientes WHERE id_cliente = ?', 
    [id_cliente]
  );

  return result.affectedRows > 0;
}
