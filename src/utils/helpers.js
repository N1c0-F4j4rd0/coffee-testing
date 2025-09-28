class Helpers {
    static async waitForPageLoad(driver, timeout = 30000) {
        return await driver.wait(async () => {
            return await driver.executeScript('return document.readyState') === 'complete';
        }, timeout);
    }

    static async scrollToElement(driver, element) {
        await driver.executeScript("arguments[0].scrollIntoView(true);", element);
        await driver.sleep(500);
    }

    static async highlightElement(driver, element) {
        await driver.executeScript(
            "arguments[0].style.border='3px solid red'", 
            element
        );
    }

    static generateTimestamp() {
        return new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}

module.exports = Helpers;