cc.Class({
    extends: cc.Component,

    properties:
    {
        GamePlay: cc.Node,
        Main:cc.Node
    },

    onLoad()
    {
        cc.log("onLoad");
        this.Main.active = true;
        this.GamePlay.active = false;
    },

    start()
    {
        cc.log("onStart");
    },

    clickBtn(sender,num)
    {
        cc.log("click button:" + num);
        this.Main.active = false;
        this.GamePlay.active = true;
        if (num == "return")
        {
            this.Main.active = true;
            this.GamePlay.active = false;
        }
    }
    // update (dt) {},
});
