cc.Class({
    extends: cc.Component,

    properties:
    {
        GamePlay: cc.Node,
        Main: cc.Node,
        pre_item_bg: cc.Prefab,
        pre_item: cc.Prefab,
        itemParent: cc.Node,
    },

    onLoad() {
        cc.log("onLoad");
        this.Main.active = true;
        this.GamePlay.active = false;
    },

    start() {
        cc.log("onStart");
    },

    clickBtn(sender, num) {
        cc.log("click button:" + num);
        if (num == "return") {
            this.Main.active = true;
            this.GamePlay.active = false;
            this.cleanItem();
        }
        else {
            this.Main.active = false;
            this.GamePlay.active = true;
            this.numItem = parseInt(num);//行列
            this.init();
        }
    },

    addItemBg: function () {
        var posStart = cc.v2(-this.itemParentW / 2 + this.itemW / 2 + this.interval, -this.itemParentW / 2 + this.itemW / 2 + this.interval);
        for (var i = 0; i < this.numItem; i++) {
            for (var j = 0; j < this.numItem; j++) {
                var node = cc.instantiate(this.pre_item_bg);
                node.parent = this.itemParent;
                node.width = this.itemW;
                node.height = this.itemW;
                node.x = posStart.x + (node.width + 5) * i;
                node.y = posStart.y + (node.height + 5) * j;
            }
        }
    },

    addItem: function () {
        var posStart = cc.v2(-this.itemParentW / 2 + this.itemW / 2 + this.interval, -this.itemParentW / 2 + this.itemW / 2 + this.interval);
        for (var i = 0; i < this.numItem; i++) {
            for (var j = 0; j < this.numItem; j++) {
                if (this.array[i][j] != 0) {
                    var node = cc.instantiate(this.pre_item);
                    node.parent = this.itemParent;
                    node.width = this.itemW;
                    node.height = this.itemW;
                    node.x = posStart.x + (node.width + 5) * i;
                    node.y = posStart.y + (node.height + 5) * (this.numItem-1-j);
                }
            }
        }
    },

    init: function () {

        this.interval = 5;//间隔
        this.itemW = Math.round(650 / this.numItem);//块大小
        this.itemParentW = this.numItem * this.itemW + (this.numItem + 1) * this.interval;//背景大小    
        this.itemParent.width = this.itemParentW;
        this.itemParent.height = this.itemParentW;

        this.initArray();
        this.addItemBg();
        this.addItem();
    },

    initArray: function () {
        this.array = new Array();
        for (let i = 0; i < this.numItem; i++) {
            this.array[i] = new Array();
        }

        for (let i = 0; i < this.numItem; i++) {
            for (let j = 0; j < this.numItem; j++) {
                this.array[i][j] = 0;
            }
        }

        this.array[0][0] = 2;
        this.array[1][1] = 2;
        cc.log(this.array);
    },

    cleanItem: function () {
        this.itemParent.removeAllChildren();
    }
    // update (dt) {},
});
