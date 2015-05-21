var Coin = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    _mapIndex: 0, // the belonging map
    get mapIndex() {
        return this._mapIndex;
    },
    set mapIndex(index) {
        this._mapIndex = index;
    },
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (spriteSheet, space, pos) {
//        console.log("Position inside coin constructor :");
//        console.log(pos);
        
        this.space = space;

        // initialize coin animation
        var animFrames = [];
        for (var i = 0; i < 8; i++) {
            var str = "coin" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.1);
        var action = new cc.RepeatForever(new cc.Animate(animation));

        this.sprite = new cc.PhysicsSprite("#coin0.png");

        //initialize physics

        var radius = 0.95 * this.sprite.getContentSize().width / 2;
        var body = new cp.StaticBody();
        body.setPos(pos);
        this.sprite.setBody(body);

        this.shape = new cp.CircleShape(body, radius, cp.vzero);
        this.shape.setCollisionType(SpriteTag.coin);
        // Snsors only call collision callbacks , don't actually generate real collisions
        this.shape.setSensor(true);

        this.space.addStaticShape(this.shape);

        //add sprite to sprite sheet
        this.sprite.runAction(action);
        spriteSheet.addChild(this.sprite, 1);
    },
    removeFromParent: function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },
    getShape: function () {
        return this.shape;
    }
})
