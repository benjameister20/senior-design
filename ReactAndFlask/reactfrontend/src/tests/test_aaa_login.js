module.exports = {
    'Test login' : function (browser) {
        browser
            .maximizeWindow()
            .url('https://parseltongue-test.herokuapp.com')
            .waitForElementVisible('body')
            .assert.titleContains('Hyposoft')
            .assert.visible('input#username-input')
            .setValue('input#username-input', 'admin')
            .pause(100)
            .setValue('input#password-input', 'P8ssw0rd1!@')
            .pause(100)
            .useXpath().assert.visible("//*[contains(text(),'Sign In')]")
            .click("//*[contains(text(), 'Sign In')]").useCss()
            .waitForElementVisible('div#homepage')
            .assert.visible('div#hompage')
            .end();
    }
};
