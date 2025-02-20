import { Pool } from 'mysql2/promise';
import { Cliente } from '../types';

export async function criarClienteDB(pool: Pool, nome: string, email: string): Promise<Cliente> {
  const [result]: any = await pool.execute(
    'INSERT INTO clientes (nome, email) VALUES (?, ?)', 
    [nome, email]
  );
  return { id_cliente: result.insertId, nome, email };
}

export async function listarClientesDB(pool: Pool, limit: number, offset: number, search: string): Promise<{ clientes: Cliente[], total: number }> {
  const query = `SELECT * FROM clientes WHERE nome LIKE '%${search}%' LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
const [clientes]: any = await pool.execute(query);

const countQuery = `SELECT COUNT(*) as total FROM clientes WHERE nome LIKE '%${search}%'`;
const [[{ total }]]: any = await pool.execute(countQuery);

return { clientes, total };

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
