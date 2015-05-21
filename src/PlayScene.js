var PlayScene = cc.Scene.extend({
    space: null,
    slidenumber: null,
    shapesToRemove: [],
    gameLayer: null,
    initPhysics: function () {
        this.space = new cp.Space();
        //2 setup the Gravity
        this.space.gravity = cp.v(0, -350);

        //3 Set up walls
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
                cp.v(0, g_groundHeight), // start point
                cp.v(4294967295, g_groundHeight), // MAX INT 
                0); // thickness of wall
        this.space.addStaticShape(wallBottom);

        this.space.addCollisionHandler(SpriteTag.runner, SpriteTag.coin,
                this.collisionCoinBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.runner, SpriteTag.rock,
                this.collisionRockBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.runner, SpriteTag.building,
                this.collisionBuildingBegin.bind(this), null, null, null);
    },
    collisionCoinBegin: function (arbiter, space) {
        //console.log("COLIDED WITH COIN");
        var shapes = arbiter.getShapes();
        // shapes[0] is the player / runner
        this.shapesToRemove.push(shapes[1]);
        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.addCoin(1);
        cc.audioEngine.playEffect(res.pickup_coin_mp3);



    },
    collisionRockBegin: function (arbiter, space) {
        cc.log("==game over");
        cc.director.pause();
        this.addChild(new GameOverLayer());
        cc.audioEngine.stopMusic();


    },
    collisionBuildingBegin: function (arbiter, space) {
        //cc.log("YOU TOUCHED THE BUILDING");
    },
    onEnter: function () {
        this._super();
        this.initPhysics();
        this.gameLayer = new cc.Layer();


        this.gameLayer.addChild(new BackgroundLayer(this.space), 0, TagOfLayer.background);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);
        this.addChild(this.gameLayer);

        this.addChild(new StatusLayer, 0, TagOfLayer.Status);

        cc.audioEngine.playMusic(res.background_mp3, true);


        this.scheduleUpdate();

    },
    update: function (dt) {
        //chipmunk step
        this.space.step(dt);

        for (var i = 0; i < this.shapesToRemove.length; i++) {
            var shape = this.shapesToRemove[i];
            this.gameLayer.getChildByTag(TagOfLayer.background).removeObjectByShape(shape);

        }
        this.shapesToRemove = [];

        var animationLayer = this.gameLayer.getChildByTag(TagOfLayer.Animation);
        var eyeX = animationLayer.getEyeX();

        this.gameLayer.setPosition(cc.p(-eyeX, 0));

    },
});
