module.exports = {
    'Test create model' : function (browser) {
        browser
            .login()
            .assert.visible('button.create-model')
            .click('button#create-model')
            .pause(100)
            .setValue('input#select-vendor', 'Dell')
            .end();
    }
};
