module.exports = {
    'Test opening site' : function (browser) {
        browser
            .url('https://parseltongue-test.herokuapp.com')
            .waitForElementVisible('body')
            .assert.titleContains('Hyposoft')
            .assert.visible('input#username-input')
            .assert.visible('button#sign-in-button')
            .end();
    }
};
