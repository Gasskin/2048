cc.Class({
    extends: cc.Component,

    properties:
    {
        GamePlay: cc.Node,
        Main: cc.Node,
        pre_item_bg: cc.Prefab,
        pre_item: cc.Prefab,
        itemParent: cc.Node,
        score:cc.Label,
    },

    onLoad() {
        this.itemPool = new cc.NodePool();
        this.Main.active = true;
        this.GamePlay.active = false;
        this.CurGameType = 0;//0:Read，1：Play，2：Over
        this.Full = false;
        this.bindTouchEvent();
    },

    clickBtn:function(sender, num) {
        if (num == "return") {
            this.Main.active = true;
            this.GamePlay.active = false;
            this.CurGameType = 0;
            this.cleanItemBg();
            this.cleanItem(this.items);
            this.Full=false;
        }
        else {
            this.Main.active = false;
            this.GamePlay.active = true;
            this.CurGameType = 1;
            this.numItem = parseInt(num);//行列
            this.init();
        }
    },

    createItem: function (i,j) {
        if(!this.Full){
            let item = null;
            if (this.array[i][j] != 0) {
                if (this.itemPool.size() > 0) {
                    item = this.itemPool.get();
                }
                else {
                    item = cc.instantiate(this.pre_item);
                }
                var posStart = cc.v2(-this.itemParentW / 2 + this.itemW / 2 + this.interval, -this.itemParentW / 2 + this.itemW / 2 + this.interval);
                item.width = this.itemW;
                item.height = this.itemW;
                item.x = posStart.x + (item.width + 5) * j;
                item.y = posStart.y + (item.height + 5) * (this.numItem - 1 - i);
                item.parent = this.itemParent;
                var num = item.getChildByName("num");
                var numLable = num.getComponent(cc.Label);
                numLable.string = this.array[i][j].toString();
                this.items.push(item);
            }
            if(!this.canMove()){
                cc.log("游戏结束!!!");
                this.Full=true;
            }
        }
        
    },

    onItemKilled: function (item) {
        this.itemPool.put(item); 
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

    canMove:function(){
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length; j++) {
                var cur=this.array[i][j];
                if(cur==0){
                    return true;
                }
                if(i>0){
                    if(cur==this.array[i-1][j]){
                        return true;
                    }
                }
                else if(i<this.numItem-1){
                    if(cur==this.array[i+1][j]){
                        return true;
                    }
                }
                else if(j>0){
                    if(cur==this.array[i][j-1]){
                        return true;
                    }
                }
                else if(j<this.numItem-1){
                    if(cur==this.array[i][j+1]){
                        return true;
                    }
                }
            }
        }
        return false;
    },

    refreshItem: function () {
        this.cleanItem(this.items);
        this.items.length = 0;

        var posStart = cc.v2(-this.itemParentW / 2 + this.itemW / 2 + this.interval, -this.itemParentW / 2 + this.itemW / 2 + this.interval);
        for (var i = 0; i < this.numItem; i++) {
            for (var j = 0; j < this.numItem; j++) {
                if (this.array[i][j] != 0) {
                    let node = null;
                    if (this.itemPool.size() > 0) {
                        node = this.itemPool.get();
                    }
                    else {
                        node = cc.instantiate(this.pre_item);
                    }
                    node.width = this.itemW;
                    node.height = this.itemW;
                    node.x = posStart.x + (node.width + 5) * j;
                    node.y = posStart.y + (node.height + 5) * (this.numItem - 1 - i);
                    node.parent = this.itemParent;
                    var num = node.getChildByName("num");
                    var numLable = num.getComponent(cc.Label);
                    numLable.string = this.array[i][j].toString();
                    this.items.push(node);
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
        this.items = new Array();
        this.cur_scores=0;

        this.addItemBg();
        this.initArray();
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

        var x = parseInt(Math.random() * this.numItem);
        var y = parseInt(Math.random() * this.numItem);
        this.array[x][y] = 2;
        this.createItem(x,y);
    },

    cleanItem:function(items){
        if(items.length<=0){
            return;
        }
        for (let i = 0; i < this.items.length; i++) {
            //this.itemParent.removeChild(items[i]);
            this.onItemKilled(items[i]);
        }
    },

    cleanItemBg: function () {
        this.itemParent.removeAllChildren();
    },

    bindTouchEvent: function () {
        this.node.on(
            "touchstart",
            function (event) {
                if (this.CurGameType == 1) {
                    this.pos_start = event.getLocation();
                }
            },
            this
        );

        this.node.on(
            "touchmove",
            function (event) {
                if (this.CurGameType == 1) {
                }
            },
            this
        );

        this.node.on(
            "touchend",
            function (event) {
                if (this.CurGameType == 1) {
                    this.pos_end = event.getLocation();
                    var pos_move_x = this.pos_end.x - this.pos_start.x;
                    var pos_move_y = this.pos_end.y - this.pos_start.y;

                    if (Math.abs(pos_move_x) > 50 || Math.abs(pos_move_y) > 50) {
                        if (Math.abs(pos_move_x) > Math.abs(pos_move_y)) {
                            if (pos_move_x > 0) {
                                this.moveItem("RIGHT");
                            }
                            else {
                                this.moveItem("LEFT");
                            }
                        }
                        else {
                            if (pos_move_y > 0) {
                                this.moveItem("TOP");
                            }
                            else {
                                this.moveItem("BOTTOM");
                            }
                        }
                        if (!this.Full) {
                            while (1) {
                                var x = parseInt(Math.random() * this.numItem);
                                var y = parseInt(Math.random() * this.numItem);
                                if (this.array[x][y] == 0) {
                                    this.refreshItem();
                                    this.array[x][y] = 2;
                                    this.createItem(x,y);
                                    cc.log(this.array);
                                    break;
                                }
                            }
                        }
                        else {

                        }

                    }
                }
            },
            this
        );
    },

    moveItem:function(direction){
        switch(direction){
            case "TOP":
                this._moveT();
                break;
            case "BOTTOM":
                this._moveB();
                break;
            case "LEFT":
                this._moveL();
                break;
            case "RIGHT":
                this._moveR();
                break;
        }
    },

    _moveT:function(){
        //列
        for (let j = 0; j < this.numItem; j++) {
            //行，从第二行开始
            for(let i=1;i<this.numItem;i++){
                var row=i;
                while(1){
                    //是0直接返回
                    if(this.array[row][j]==0){
                        break;
                    }
                    else{
                        //如果上一行是0，那交换
                        if(this.array[row-1][j]==0){
                            this.array[row-1][j]=this.array[row][j];
                            this.array[row][j]=0;
                            row--;
                        }
                        //如果上一行不是0，考虑是否可以合并
                        else{
                            if(this.array[row][j]==this.array[row-1][j]){
                                this.cur_scores+=this.array[row][j];
                                this.score.string=this.cur_scores;
                                this.array[row][j]=0;
                                this.array[row-1][j]*=2;
                            }
                            //不管能不能合并，此次移动都结束了
                            break;
                        }
                        //如果row超过边界，则结束
                        if(row<=0){
                            break;
                        }
                    }
                }
            }
        }
    },

    _moveB:function(){
        var i,j;
        //列
        for (j = 0; j <this.numItem; j++) {
            //行，从n-2行开始
            for (i = this.numItem-2;i>=0;i--) {
                var row=i;
                while(1){
                    //是0直接返回
                    if(this.array[row][j]==0){
                        break;
                    }
                    else{
                        //如果下一行是0，那交换
                        if(this.array[row+1][j]==0){
                            this.array[row+1][j]=this.array[row][j];
                            this.array[row][j]=0;
                            row++;
                        }
                        //如果下一行不是0，考虑是否可以合并
                        else{
                            if(this.array[row][j]==this.array[row+1][j]){
                                this.cur_scores+=this.array[row][j];
                                this.score.string=this.cur_scores;
                                this.array[row][j]=0;
                                this.array[row+1][j]*=2;
                            }
                            //不管能不能合并，此次移动都结束了
                            break;
                        }
                        //如果row超过边界，则结束
                        if(row>=this.numItem-1){
                            break;
                        }
                    }
                }
            }
        }
    },

    _moveL:function(){
        //行
        for(let i=0;i<this.numItem;i++){
            //列，第二列开始
            for(let j=1;j<this.numItem;j++){
                var col=j;
                while(1){
                    //是0直接返回
                    if(this.array[i][col]==0){
                        break;
                    }
                    else{
                        //如果前一列是0，那交换
                        if(this.array[i][col-1]==0){
                            this.array[i][col-1]=this.array[i][col];
                            this.array[i][col]=0;
                            col--;
                        }
                        //如果前一列不是0，考虑是否可以合并
                        else{
                            if(this.array[i][col]==this.array[i][col-1]){
                                this.cur_scores+=this.array[i][col];
                                this.score.string=this.cur_scores;
                                this.array[i][col]=0;
                                this.array[i][col-1]*=2;
                            }
                            //不管能不能合并，此次移动都结束了
                            break;
                        }
                        //如果row超过边界，则结束
                        if(col<=0){
                            break;
                        }
                    }
                }
            }
        }
    },

    _moveR:function(){
        //行
        for(let i=0;i<this.numItem;i++){
            //列，第n-2列开始
            for(let j=this.numItem-2;j>=0;j--){
                var col=j;
                while(1){
                    //是0直接返回
                    if(this.array[i][col]==0){
                        break;
                    }
                    else{
                        //如果后一列是0，那交换
                        if(this.array[i][col+1]==0){
                            this.array[i][col+1]=this.array[i][col];
                            this.array[i][col]=0;
                            col++;
                        }
                        //如果前一列不是0，考虑是否可以合并
                        else{
                            if(this.array[i][col]==this.array[i][col+1]){
                                this.cur_scores+=this.array[i][col];
                                this.score.string=this.cur_scores;
                                this.array[i][col]=0;
                                this.array[i][col+1]*=2;
                            }
                            //不管能不能合并，此次移动都结束了
                            break;
                        }
                        //如果row超过边界，则结束
                        if(col>=this.numItem){
                            break;
                        }
                    }
                }
            }
        }
    },

    // update (dt) {},
});
