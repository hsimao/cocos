// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    jumpHeight: 0,
    jumpDuration: 0,
    maxMoveSpeed: 0,
    accel: 0,
    jumpAudio: {
      default: null,
      type: cc.AudioClip
    }
  },

  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = true;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = true;
        break;
    }
  },

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = false;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = false;
        break;
    }
  },

  runJumpAction: function () {
    // 跳跃上升
    var jumpUp = cc
      .tween()
      .by(this.jumpDuration, { y: this.jumpHeight }, { easing: "sineOut" });

    // 下落
    var jumpDown = cc
      .tween()
      .by(this.jumpDuration, { y: -this.jumpHeight }, { easing: "sineIn" });

    const callback = cc.callFunc(this.playJumpSound, this);
    // 创建一个缓动
    var tween = cc
      .tween()
      // 按 jumpUp，jumpDown 的顺序执行动作
      .sequence(jumpUp, jumpDown, callback);

    // 不断重复
    return cc.tween().repeatForever(tween);
  },

  playJumpSound: function () {
    cc.audioEngine.playEffect(this.jumpAudio, false);
  },

  // LIFE-CYCLE
  onLoad: function () {
    // init jump action
    var jumpAction = this.runJumpAction();
    cc.tween(this.node).then(jumpAction).start();

    this.accLeft = false;
    this.accRight = false;
    // 主角当前水平方向速度
    this.xSpeed = 0;

    // listen keyboard
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onDestory() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  start() {},

  update: function (dt) {
    // 根据当前加速度方向每帧更新速度
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    }
    // 限制主角的速度不能超过最大值
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      // if speed reach limit, use max speed with current direction
      this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
    }

    // 根据当前速度更新主角的位置
    this.node.x += this.xSpeed * dt;
  }
});
