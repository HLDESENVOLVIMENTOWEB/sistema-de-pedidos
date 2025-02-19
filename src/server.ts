import Fastify from 'fastify';
import dotenv from 'dotenv';
import produtoRoutes from './routes/produtoRoutes';
import clienteRoutes from './routes/clienteRoutes';
import pedidoRoutes from './routes/pedidoRoutes';

dotenv.config();

const fastify = Fastify({ logger: true });

const startServer = async () => {
  fastify.register(produtoRoutes);
  fastify.register(clienteRoutes);
  fastify.register(pedidoRoutes);

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
