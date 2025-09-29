const Logger = require('../utils/logger');

// Configuración global para Jest
beforeAll(() => {
    Logger.info('🧪 INICIANDO SUITE DE TESTS CON JEST');
    Logger.info('='.repeat(50));
});

afterAll(() => {
    Logger.info('='.repeat(50));
    Logger.info('🏁 SUITE DE TESTS COMPLETADA');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    Logger.error('🚨 Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    Logger.error('🚨 Uncaught Exception:', error.message);
});