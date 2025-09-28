class Logger {
    static log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type}] ${message}`;
        
        console.log(logMessage);
        
        // Aquí puedes agregar escritura a archivo de log si lo deseas
        this.writeToFile(logMessage);
    }

    static info(message) {
        this.log(message, 'INFO');
    }

    static error(message) {
        this.log(message, 'ERROR');
    }

    static warn(message) {
        this.log(message, 'WARN');
    }

    static success(message) {
        this.log(message, 'SUCCESS');
    }

    static writeToFile(message) {
        try {
            const fs = require('fs');
            const path = require('path');
            
            const logDir = path.join(__dirname, '../../reports/logs');
            const logFile = path.join(logDir, `automation-${new Date().toISOString().split('T')[0]}.log`);
            
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            
            fs.appendFileSync(logFile, message + '\n');
        } catch (error) {
            // Silenciar errores de escritura de log
        }
    }
}

module.exports = Logger;