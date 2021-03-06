var BackgroundLayer = cc.Layer.extend({
    map00: null,
    map01: null,
    map02: null,
    buildingSheet: null,
    mapWidth: 0,
    mapIndex: 0,
    space: null,
    spriteSheet: null,
    objects: [],
    ctor: function (space) {
        this._super();


        this.objects = [];
        this.space = space;
        this.init();
    },
    init: function () {
        this._super();

        this.map00 = new cc.TMXTiledMap.create(res.map00_tmx);
        this.addChild(this.map00);

        this.mapWidth = this.map00.getContentSize().width;

        this.map01 = new cc.TMXTiledMap.create(res.map01_tmx);
        this.map01.setPosition(cc.p(this.mapWidth, 0));
        this.addChild(this.map01);
        //This is the map with the new 
        //This is the map with the new 
        this.map02 = new cc.TMXTiledMap.create(res.map02_tmx);
        this.map02.setPosition(cc.p(this.mapWidth, 0));
        this.addChild(this.map02);




        //create spritesheet
        cc.spriteFrameCache.addSpriteFrames(res.background_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.background_png);
        this.addChild(this.spriteSheet);

        cc.spriteFrameCache.addSpriteFrames(res.building_plist);
        this.buildingSheet = new cc.SpriteBatchNode(res.building_png);
        this.addChild(this.buildingSheet);

//        console.log(this.map00);
        this.loadObjects(this.map00, 0);
        this.loadObjects(this.map01, 1);
        this.scheduleUpdate();
    },
    loadObjects: function (map, mapIndex) {
        //add coins
        var coinGroup = map.getObjectGroup("coin");
        if (coinGroup) {
            var coinArray = coinGroup.getObjects();
            for (var i = 0; i < coinArray.length; i++) {
                var coin = new Coin(this.spriteSheet,
                        this.space,
                        cc.p(coinArray[i]["x"] + this.mapWidth * mapIndex, coinArray[i]["y"]));
                coin.mapIndex = mapIndex;
                this.objects.push(coin);
            }
        }
        //add rock

        var rockGroup = map.getObjectGroup("rock");
        if (rockGroup) {
            var rockArray = rockGroup.getObjects();
            for (var i = 0; i < rockArray.length; i++) {
                //   console.log(this.spriteSheet);
                var rock = new Rock(this.spriteSheet,
                        this.space,
                        rockArray[i]["x"] + this.mapWidth * mapIndex);
                rock.mapIndex = mapIndex;
                this.objects.push(rock);
            }
        }

        var buildingGroup = map.getObjectGroup("building");
        if (buildingGroup) {
            var buildingArray = buildingGroup.getObjects();
            for (var i = 0; i < buildingArray.length; i++) {
                var theposition = buildingArray[i]["x"] + this.mapWidth * mapIndex;
                var sbuilding = new Building(this.buildingSheet,
                        this.space,
                        theposition);
                sbuilding.mapIndex = mapIndex;
                this.objects.push(sbuilding);
            }
        }
    },
    checkAndReload: function (eyeX, endGamePoint) {
        var newMapIndex = parseInt(eyeX / this.mapWidth);
        var endGamePoint = endGamePoint;
        cc.log(endGamePoint);

        if ((parseInt(eyeX) > endGamePoint)) {
            cc.log("EyeX is more than endgame.");
            var newPositionX = this.mapWidth * (newMapIndex + 1);
            this.map02.setPositionX(newPositionX);
            this.loadObjects(this.map02, newMapIndex + 1);
            return true;
        }



        if (this.mapIndex == newMapIndex) {
            return false;
        }
        if (0 == newMapIndex % 2) {
            //change mapSecond
            if (parseInt(eyeX) < endGamePoint) {
                cc.log("EyeX is smaller than endgame.");
                this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
                this.loadObjects(this.map01, newMapIndex + 1);
            }

        } else {
            //change mapFirst
            if (parseInt(eyeX) < endGamePoint) {
                cc.log("EyeX is smaller than endgame.");
                this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
                this.loadObjects(this.map00, newMapIndex + 1);
            }
        }
        this.removeObjects(newMapIndex - 1);
        this.mapIndex = newMapIndex;
        return true;


    },
    update: function (dt) {
        var animationLayer = this.getParent().getChildByTag(TagOfLayer.Animation);
        var eyeX = animationLayer.getEyeX();
        this.checkAndReload(eyeX, 1200);
    },
    removeObjects: function (mapIndex) {
        while ((function (obj, index) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].mapIndex == index) {
                    obj[i].removeFromParent();
                    obj.splice(i, 1);
                    return true;
                }
            }
            return false;
        })(this.objects, mapIndex))
            ;
    },
    removeObjectByShape: function (shape) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getShape() == shape) {
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    },
});
