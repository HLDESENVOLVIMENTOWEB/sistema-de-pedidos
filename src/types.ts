export interface Produto {
    id_produto?: number;
    nome: string;
    preco: number;
  }
  
  export interface Cliente {
    id_cliente?: number;
    nome: string;
    email: string;
  }
  
  export interface PedidoItem {
    id_produto: number;
    qtde: number;
    preco: number;
  }
  
  export interface Pedido {
    id_pedido?: number;
    id_cliente: number;
    itens: PedidoItem[];
  }
  