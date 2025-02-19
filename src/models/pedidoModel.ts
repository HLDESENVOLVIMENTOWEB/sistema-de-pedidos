import { Pool } from 'mysql2/promise';
import { Pedido, PedidoItem } from '../types';

export async function criarPedidoDB(pool: Pool, id_cliente: number, itens: PedidoItem[]): Promise<Pedido> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [pedido]: any = await connection.execute(
      'INSERT INTO pedidos (data, id_cliente) VALUES (NOW(), ?)', 
      [id_cliente]
    );

    for (const item of itens) {
      await connection.execute(
        'INSERT INTO pedido_itens (id_pedido, id_produto, qtde, preco) VALUES (?, ?, ?, ?)',
        [pedido.insertId, item.id_produto, item.qtde, item.preco]
      );
    }

    await connection.commit();

    return { id_pedido: pedido.insertId, id_cliente, itens };
  } catch (error) {
    await connection.rollback();
    throw new Error('Erro ao criar pedido: ' + error);
  } finally {
    connection.release();
  }
}

export async function listarPedidosDB(pool: Pool, page: number = 1, limit: number = 10): Promise<{ pedidos: Pedido[], total: number }> {
  const connection = await pool.getConnection();

  try {
    const offset = (page - 1) * limit;

    const [[{ total }]]: any = await connection.execute('SELECT COUNT(*) as total FROM pedidos');

    const [pedidos]: any = await connection.execute(
      'SELECT * FROM pedidos LIMIT ? OFFSET ?',
      [limit, offset]
    );

    for (const pedido of pedidos) {
      const [itens]: any = await connection.execute(
        'SELECT * FROM pedido_itens WHERE id_pedido = ?',
        [pedido.id_pedido]
      );
      pedido.itens = itens;
    }

    return { pedidos, total };
  } catch (error) {
    throw new Error('Erro ao listar pedidos: ' + error);
  } finally {
    connection.release();
  }
}


export async function atualizarPedidoDB(pool: Pool, id_pedido: number, id_cliente: number, itens: PedidoItem[]): Promise<Pedido | null> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [pedido]: any = await connection.execute(
      'UPDATE pedidos SET id_cliente = ? WHERE id_pedido = ?', 
      [id_cliente, id_pedido]
    );

    if (pedido.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    await connection.execute('DELETE FROM pedido_itens WHERE id_pedido = ?', [id_pedido]);

    for (const item of itens) {
      await connection.execute(
        'INSERT INTO pedido_itens (id_pedido, id_produto, qtde, preco) VALUES (?, ?, ?, ?)',
        [id_pedido, item.id_produto, item.qtde, item.preco]
      );
    }

    await connection.commit();

    return { id_pedido, id_cliente, itens };
  } catch (error) {
    await connection.rollback();
    throw new Error('Erro ao atualizar pedido: ' + error);
  } finally {
    connection.release();
  }
}

export async function deletarPedidoDB(pool: Pool, id_pedido: number): Promise<boolean> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM pedido_itens WHERE id_pedido = ?', [id_pedido]);
    const [pedido]: any = await connection.execute(
      'DELETE FROM pedidos WHERE id_pedido = ?', 
      [id_pedido]
    );

    if (pedido.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw new Error('Erro ao deletar pedido: ' + error);
  } finally {
    connection.release();
  }
}
