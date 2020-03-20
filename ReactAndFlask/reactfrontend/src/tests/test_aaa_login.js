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
            .assert.visible('button.sign-in')
            .click('button.sign-in')
            .waitForElementVisible('div#homepage')
            .assert.visible('div#hompage')
            .end();
    }
};
