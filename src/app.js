var MenuLayer = cc.Layer.extend({
    ctor: function () {
        //1. call super class's ctor function
        this._super();
    },
    init: function () {
        //call super class's super function
        this._super();
        //2. get the screen size of your game canvas
        var winsize = cc.director.getWinSize();
        //3. calculate the center point of the screen.
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);
        //4. create a background image and set it's position at the center of the screen
        var spritebg = new cc.Sprite(res.background_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);
        //5. Set the menu item font ?
        cc.MenuItemFont.setFontSize(60);
        //6. create a menu and assign onPlay event callback to it.
        var menuItemPlay = new cc.MenuItemSprite(
                new cc.Sprite(res.start_n_png),
                new cc.Sprite(res.start_s_png),
                this.onPlay(),
                this);
        var menu = new cc.Menu(menuItemPlay); // 7. Create the menu
        menu.setPosition(centerpos);
        this.addChild(menu);
    },
    onPlay: function () {
        cc.log("==onplay clicked");
        cc.director.runScene(new PlayScene());
    }
});

var MenuScene = cc.Scene.extend(
        {
            onEnter: function () {
                this._super();
                var layer = new MenuLayer();
                layer.init();
                this.addChild(layer);
            }
        });