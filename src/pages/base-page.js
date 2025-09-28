const { until, By } = require('selenium-webdriver');
const Logger = require('../utils/logger');

class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async navigateTo(url) {
        Logger.info(`🌐 Navegando a: ${url}`);
        await this.driver.get(url);
    }

    async waitForElement(selector, timeout = 15000) {
        Logger.info(`⏳ Esperando elemento: ${selector}`);
        try {
            return await this.driver.wait(until.elementLocated(selector), timeout);
        } catch (error) {
            Logger.error(`❌ Timeout esperando elemento: ${selector}`);
            throw error;
        }
    }

    async waitForElementVisible(selector, timeout = 15000) {
        const element = await this.waitForElement(selector, timeout);
        return await this.driver.wait(until.elementIsVisible(element), timeout);
    }

    async clickElement(selector) {
        const element = await this.waitForElementVisible(selector);
        Logger.info(`🖱️ Haciendo clic en: ${selector}`);
        await element.click();
    }

    async typeText(selector, text) {
        const element = await this.waitForElementVisible(selector);
        Logger.info(`⌨️ Escribiendo texto en: ${selector}`);
        await element.clear();
        await element.sendKeys(text);
    }

    async getElementText(selector) {
        const element = await this.waitForElementVisible(selector);
        const text = await element.getText();
        Logger.info(`📄 Obteniendo texto de: ${selector} -> "${text}"`);
        return text;
    }

    async isElementPresent(selector) {
        try {
            await this.waitForElement(selector, 5000);
            return true;
        } catch (error) {
            return false;
        }
    }

    async findElements(selector) {
        return await this.driver.findElements(selector);
    }

    async sleep(ms) {
        await this.driver.sleep(ms);
    }

    async getPageTitle() {
        return await this.driver.getTitle();
    }

    async getCurrentUrl() {
        return await this.driver.getCurrentUrl();
    }
}

module.exports = BasePage;