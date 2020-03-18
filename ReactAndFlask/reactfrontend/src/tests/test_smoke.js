module.exports = {
    'Test opening site' : function (browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .assert.titleContains('Hyposoft')
            .assert.visible('input#username-input')
            .assert.visible('button#sign-in-button')
            .end();
    }
};
