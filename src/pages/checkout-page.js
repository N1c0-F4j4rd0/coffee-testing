const { By } = require('selenium-webdriver');
const BasePage = require('./base-page');
const Logger = require('../utils/logger');

class CheckoutPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    // Selectores para formulario de checkout
    get nameField() { return By.css('input[name="name"], #name, [placeholder*="name"]'); }
    get emailField() { return By.css('input[name="email"], #email, [placeholder*="email"]'); }
    get addressField() { return By.css('input[name="address"], #address, [placeholder*="address"]'); }
    get cityField() { return By.css('input[name="city"], #city, [placeholder*="city"]'); }
    get zipField() { return By.css('input[name="zip"], #zip, [placeholder*="zip"]'); }
    get submitButton() { return By.css('button[type="submit"], input[type="submit"], [class*="submit"]'); }

    async fillCheckoutForm(userData) {
        Logger.info('📝 Llenando formulario de checkout...');
        
        const fields = [
            { selector: this.nameField, value: userData.name || 'Juan Pérez' },
            { selector: this.emailField, value: userData.email || 'juan.perez@ejemplo.com' },
            { selector: this.addressField, value: userData.address || 'Calle Principal 123' },
            { selector: this.cityField, value: userData.city || 'Ciudad de México' },
            { selector: this.zipField, value: userData.zip || '12345' }
        ];

        let filledCount = 0;

        for (let field of fields) {
            try {
                const elements = await this.findElements(field.selector);
                if (elements.length > 0) {
                    await elements[0].clear();
                    await elements[0].sendKeys(field.value);
                    filledCount++;
                    Logger.success(`✅ Campo llenado: ${field.value}`);
                }
            } catch (error) {
                Logger.warn(`⚠️ No se pudo llenar campo: ${field.selector}`);
            }
        }

        Logger.info(`📊 Campos llenados: ${filledCount} de ${fields.length}`);
        return filledCount;
    }

    async submitOrder() {
        try {
            Logger.info('🚀 Enviando orden...');
            const buttons = await this.findElements(this.submitButton);
            
            for (let button of buttons) {
                try {
                    const buttonText = await button.getText();
                    if (buttonText.toLowerCase().includes('submit') || 
                        buttonText.toLowerCase().includes('order') ||
                        buttonText.toLowerCase().includes('purchase') ||
                        buttonText.toLowerCase().includes('comprar')) {
                        
                        await button.click();
                        Logger.success('✅ Orden enviada');
                        return true;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            Logger.warn('⚠️ No se encontró botón de envío');
            return false;
        } catch (error) {
            Logger.error(`❌ Error enviando orden: ${error.message}`);
            return false;
        }
    }
}

module.exports = CheckoutPage;