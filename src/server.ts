import Fastify from 'fastify';
import dotenv from 'dotenv';
import produtoRoutes from './routes/produtoRoutes';
import clienteRoutes from './routes/clienteRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import cors from '@fastify/cors';

dotenv.config();

const fastify = Fastify({ logger: true });

// Registrar CORS antes das rotas
fastify.register(cors, {
  origin: '*', // Permitir todas as origens. Você pode especificar uma origem específica, como 'http://localhost:5173'
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
});

const startServer = async () => {
  fastify.register(produtoRoutes);
  fastify.register(clienteRoutes);
  fastify.register(pedidoRoutes);

  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
