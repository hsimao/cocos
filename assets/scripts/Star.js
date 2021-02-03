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
    // 更新分數
    this.game.gainScore();
    // 刪除自己
    this.node.destroy();
  },

  update: function (dt) {
    if (this.getPlayerDistance() < this.pickRadius) {
      this.onPicked();
      return;
    }

    // 根据 Game 脚本中的计时器更新星星的透明度
    var opacityRatio = 1 - this.game.timer / this.game.starDuration;
    var minOpacity = 50;
    this.node.opacity =
      minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
  }
});
