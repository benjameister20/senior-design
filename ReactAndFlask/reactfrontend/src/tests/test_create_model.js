module.exports = {
    'Test create model' : function (browser) {
        browser
            .maximizeWindow()
            .url('https://parseltongue-test.herokuapp.com')
            .waitForElementVisible('body')
            .assert.titleContains('Hyposoft')
            .assert.visible('button.create-model')
            .useXpath().click("//*[contains(text(),'Create')]")
            .pause(100)
            .setValue('input#select-vendor', 'Dell')
            .end();
    }
};
