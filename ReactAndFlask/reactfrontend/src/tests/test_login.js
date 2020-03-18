module.exports = {
    'Test login' : function (browser) {
        browser
            .maximizeWindow()
            .url('https://parseltongue-dev.herokuapp.com')
            .waitForElementVisible('body')
            .assert.titleContains('Hyposoft')
            .assert.visible('input#username-input')
            .setValue('input#username-input', 'admin')
            .pause(1000)
            .setValue('input#password-input', 'P8ssw0rd1!@')
            .pause(1000)
            .assert.visible('button#sign-in-button')
            .click('button#sign-in-button')
            .waitForElementVisible('div#homepage')
            .assert.visible('div#hompage')
            .end();
    }
};
