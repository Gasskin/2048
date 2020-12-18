cc.Class({
    extends: cc.Component,

    properties: {
       labTime:cc.Label,
    },

    onLoad()
    {
        this.curTime = 5;
        this.labTime.string = this.curTime;
        this.schedule(function ()
        {
            if (this.curTime != 0)
            {
                this.curTime--;
                this.labTime.string = this.curTime;
            }
            if (this.curTime == 0)
            {
                cc.director.loadScene("main");
            }
        },1);
    },

    btnClick: function ()
    {
        cc.director.loadScene("main");    
    }
    // update (dt) {},
});
