var Building = cc.Class.extend({
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
    ctor: function (spriteSheet, space, posX) {
//        console.log("Position inside building constructor :");
//        console.log(posX);

        this.space = space;

//         initialize coin animation
        var animFrames = [];
        for (var i = 0; i < 2; i++) {
            var str = "reeabuilding_small" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.4);
        var action = new cc.RepeatForever(new cc.Animate(animation));

        this.sprite = new cc.PhysicsSprite("#reeabuilding_small0.png");

        //initialize physics

        var radius = 0.95 * this.sprite.getContentSize().width / 2;
        var body = new cp.StaticBody();

        body.setPos(cc.p(posX, this.sprite.getContentSize().height / 2 + g_groundHeight));
//        body.setPos(pos);
        this.sprite.setBody(body);

        this.shape = new cp.CircleShape(body, radius, cp.vzero);
        this.shape.setCollisionType(SpriteTag.building);
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
