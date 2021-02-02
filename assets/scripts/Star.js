// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    pickRadius: 0
  },

  getPlayerDistance: function () {
    const playerPos = this.game.player.getPosition();
    const dist = this.node.position.sub(playerPos).mag();
    return dist;
  },

  // 碰撞到星星
  onPicked: function () {
    // 建立新的星星
    this.game.spawnNewStar();
    // 刪除自己
    this.node.destroy();
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {},

  update: function (dt) {
    if (this.getPlayerDistance() < this.pickRadius) {
      this.onPicked();
      return;
    }
  }
});
