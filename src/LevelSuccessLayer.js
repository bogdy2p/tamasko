var LevelSuccessLayer = cc.LayerColor.extend({
    //constructor
//    level: null,
    
    ctor: function ( level ) {
        this._super();
//        this.level = "Level"+level;
        this.init();
    },
    init: function () {
        this._super(cc.color(0, 0, 0, 180));
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        cc.MenuItemFont.setFontSize(32);

        var menuItemRestart = new cc.MenuItemSprite(
                new cc.Sprite(res.success_s_png),
                new cc.Sprite(res.success_n_png),
                this.onRestart, this);
        var menu = new cc.Menu(menuItemRestart);
        menu.setPosition(centerPos);
        this.addChild(menu);

    },
        onRestart: function(sender){
        cc.director.resume();
        cc.director.runScene(new PlayScene());
    }
});