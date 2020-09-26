import back from '../../images/back.png';
import refresh from '../../images/refresh.png';
import enter from '../../images/enter.png';


export class KeyPad {
  constructor(stageWidth, stageHeight, radius, index) {
    this.radius = stageWidth / 15;
    this.diameter = this.radius;
    this.position(stageWidth, stageHeight, index);
    this.index = index

    // 키패드
    this.isClicked = false;
    this.backIcon = new Image();
    this.backIcon.src = back;
    this.refreshIcon = new Image();
    this.refreshIcon.src = refresh;
    this.enterIcon = new Image();
    this.enterIcon.src = enter;

    this.keys = {
      10: '0',
      11: this.backIcon,
      12: this.refreshIcon,
      13: this.enterIcon
    }
  }

  position(stageWidth, stageHeight, index) {
    if(index !== 0){
      if (index < 5) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 1);
        this.y = stageHeight / 1.5;
      } else if (index < 9) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 5);
        this.y = stageHeight / 1.5 + stageHeight / 10;
      } else if (index < 13) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 9);
        this.y = stageHeight / 1.5 + (stageHeight / 10) * 2;
      } else if (index === 13) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 10);
        this.y = stageHeight / 1.5 - stageHeight / 10;
      }
    }
  }

  clicked(mouseX, mouseY, index, limit) {
    let objToMouseX = Math.pow(this.x - mouseX, 2);
    let objToMouseY = Math.pow(this.y - mouseY, 2);
    let objToMouseResult = Math.sqrt(objToMouseX + objToMouseY); // 거리측정

    if (objToMouseResult < this.diameter) {
      if (index < 10 && !limit) {
        this.isClicked = true;
        return index;
      } else if (index === 10) {
        this.isClicked = true;
        return index - 10;
      } else if (index > 10) {
        this.isClicked = true;
        return index;
      }
    }
  }

  removed () {
    this.isClicked = false;
  }

  draw (ctx, stageWidth, stageHeight, index) {
    if (this.isClicked) {
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, (stageWidth / 15), 0, 2 * Math.PI);
      ctx.stroke();
      if ([11, 12, 13].includes(index)) {
        setTimeout(() => this.removed(), 300);
      }
    } else {
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#c9c9c9';
      ctx.shadowBlur = stageWidth/40;
      ctx.shadowOffsetY = stageWidth/100 * -1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, (stageWidth / 15), 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }

    if ([11, 12, 13].includes(index)) {
      ctx.drawImage(this.keys[index], this.x - this.radius/2.1, this.y - this.radius/2.3, this.radius, this.radius);
    } else {
      ctx.fillStyle = '#000';
      ctx.font = `${this.radius}px serif`;
      ctx.fillText(`${this.index !== 10 ? this.index : this.keys[index]}`, this.x - this.radius / 3, this.y + this.radius / 3)
    }
  }
}
