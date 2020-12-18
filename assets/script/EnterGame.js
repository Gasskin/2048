cc.Class({
    extends: cc.Component,

    properties:
    {

    },

    onLoad()
    {
        cc.log("onLoad");
    },

    start()
    {
        cc.log("onStart");
    },

    clickBtn(sender,num)
    {
        cc.log("click button:"+num);
    }
    // update (dt) {},
});
