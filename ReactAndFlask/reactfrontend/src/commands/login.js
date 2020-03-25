module.exports.command = function() {
    this.perform(function() {
        this.maximizeWindow()
            .url('https://parseltongue-test.herokuapp.com')
            .waitForElementVisible('body')
            .assert.titleContains('Hyposoft')
            .assert.visible('input#username-input')
            .setValue('input#username-input', 'admin')
            .pause(100)
            .setValue('input#password-input', 'P8ssw0rd1!@')
            .pause(100)
            .assert.visible('button#sign-in-button')
            .click('button#sign-in-button')
            .pause(1000)
            .assert.visible('div#homepage')
    });
}
