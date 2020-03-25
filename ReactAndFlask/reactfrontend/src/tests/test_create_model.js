module.exports = {
    'Test create model' : function (browser) {
        browser
            .login()
            .assert.visible('button#create-button')
            .click('button#create-button')
            .pause(500)
            .setValue('input#select-vendor', 'Dell')
            .setValue('input#model-num', '9876')
            .setValue('input#height', '2')
            .click('button#create-model-button')
            .pause(1000)
            .end();
    }
};
