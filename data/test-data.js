module.exports = {
    users: {
        standard: {
            name: 'Juan Pérez',
            email: 'juan.perez@ejemplo.com',
            address: 'Calle Principal 123',
            city: 'Ciudad de México',
            zipCode: '12345',
            phone: '+52 55 1234 5678'
        },
        premium: {
            name: 'María García',
            email: 'maria.garcia@empresa.com',
            address: 'Avenida Reforma 456',
            city: 'Guadalajara',
            zipCode: '44100',
            phone: '+52 33 9876 5432'
        }
    },
    
    products: {
        minExpected: 3,
        maxToAdd: 5,
        timeout: 15000
    },
    
    payment: {
        creditCard: '4111 1111 1111 1111',
        expiry: '12/25',
        cvv: '123'
    },
    
    timeouts: {
        short: 5000,
        medium: 10000,
        long: 30000,
        veryLong: 60000
    }
};