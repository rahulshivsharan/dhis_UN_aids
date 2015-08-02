'use strict';
describe('The Starting Page', function() {
    var page;
    var isVisible = function(element) {
        return protractor.ExpectedConditions.elementToBeClickable(element)();
    };
    beforeEach(function() {
        browser.get('/index.html');
        page = require('./main.po');
    });
    it('should show the header text', function() {
        expect(page.headerText.getText()).toBe('Médecins Sans Frontières');
    });

    it('should show the setup and settings pages', function() {
        expect(isVisible(page.setupPage)).toBe(true);
        expect(isVisible(page.settingsPage)).toBe(true);
    });

    it('should navigate between the settings and setup pages', function() {
        expect(isVisible(page.settingsLegend)).toBe(false);
        page.settingsPage.click();
        expect(isVisible(page.settingsLegend)).toBe(true);
    });
});
