cc.Class({
    extends: cc.Component,

    properties:
    {
        GamePlay: cc.Node,
        Main: cc.Node,
        Prefab_item: cc.Prefab,
    },

    onLoad()
    {
        cc.log("onLoad");
        this.Main.active = true;
        this.GamePlay.active = false;
        this.addItem();
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
    },

    addItem()
    {
        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                var node = cc.instantiate(this.Prefab_item);
                node.parent = this.GamePlay;
                node.width = 100;
                node.height = 100;
                node.x = (node.width + 5) * i;
                node.y = (node.height + 5) * j;
            }
        }
    }
    // update (dt) {},
});
