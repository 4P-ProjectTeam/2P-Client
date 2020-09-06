export class Bullet {
  constructor(stageWidth, stageHeight, radius, moveX, moveY, blockPosX, blockPosY, blockSizeX) {
    this.radius = radius;
    this.vx = moveX;
    this.vy = moveY;
    this.x = blockPosX + (blockSizeX / 2);
    this.y = blockPosY;
    this.stop = true;
    this.blockPrePosX = 0;
    this.RivalPrePosX = 0;
  }

  drawMyBullet(ctx, stageWidth, stageHeight, 
    RivalPosX, RivalPosY, RivalSizeX, RivalSizeY
    ){
    let miss = this.bounceWindow(stageWidth, stageHeight);
    let strike = this.bounceRival(RivalPosX, RivalPosY, RivalSizeX, RivalSizeY);
    ctx.fillStyle = '#ffff8c';
    ctx.beginPath();
    
    this.x += this.vx;
    this.y -= this.vy;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    if(miss) return { result: false };
    if(strike) return { result: true };
  }

  drawRivalBullet(ctx, stageWidth, stageHeight,
    blockPosX, blockPosY, blockSizeX, blockSizeY,
    ){
    let miss = this.bounceWindow(stageWidth, stageHeight);
    let strike = this.bounceBlock(blockPosX, blockPosY, blockSizeX, blockSizeY);
    ctx.fillStyle = '#FA5858';
    ctx.beginPath();
    this.x += this.vx;
    this.y += this.vy;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    if(miss) return { result: false };
    if(strike) return { result: true };
  }

  stoppp(myTurn) {
    this.stop = !this.stop;
    if(!myTurn){
      this.vx *= -1;
      this.vy *= -1;
    }
  }

  bounceWindow(stageWidth, stageHeight) {
    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;

    if (this.x <= minX || this.x >= maxX) {
      this.vx *= -1;
    } else  if (this.y <= minY || this.y >= maxY) {
      return true
    } 
  }

  bounceBlock(blockPosX, blockPosY, blockSizeX, blockSizeY) {
    const minX = blockPosX - this.radius;
    const maxX = blockPosX + blockSizeX + this.radius;
    const minY = blockPosY - this.radius;
    const maxY = blockPosY + blockSizeY + this.radius;

    if(this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
      const x1 = Math.abs(minX - this.x);
      const x2 = Math.abs(this.x - maxX);
      const y1 = Math.abs(minY - this.y);
      const y2 = Math.abs(this.y - maxY);
      const min1 = Math.min(x1, x2);
      const min2 = Math.min(y1, y2);
      const min = Math.min(min1, min2);

      if (min === min1 || min === min2) { 
        return true
      } 
    }
  }

  bounceRival(RivalPosX, RivalPosY, RivalSizeX, RivalSizeY) {
    const minX = RivalPosX - this.radius;
    const maxX = RivalPosX + RivalSizeX + this.radius;
    const minY = RivalPosY - this.radius;
    const maxY = RivalPosY + RivalSizeY + this.radius;

    if(this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
      const x1 = Math.abs(minX - this.x);
      const x2 = Math.abs(this.x - maxX);
      const y1 = Math.abs(minY - this.y);
      const y2 = Math.abs(this.y - maxY);
      const min1 = Math.min(x1, x2);
      const min2 = Math.min(y1, y2);
      const min = Math.min(min1, min2);

      if(min === min1 || min === min2) {  
        return true
      } 
    }
  }
}