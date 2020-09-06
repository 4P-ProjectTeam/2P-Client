import { keys } from "@material-ui/core/styles/createBreakpoints";

import back from '../../images/back.png'
import refresh from '../../images/refresh.png'
import enter from '../../images/enter.png'

let molegif = [];
let holeImgs;
let isImported = false;

export class KeyPad {
  constructor(stageWidth, stageHeight, radius, index) {
    this.radius = stageWidth / 15;
    this.diameter = this.radius;
    this.position(stageWidth, stageHeight, index);
    this.index = index

    if (isImported === false) {
      // mole png 여러장 가져오기
      let req = require.context('../../images/mole', false, /.*\.png$/);
      req.keys().forEach(function (key) {
        molegif.push(req(key));
      });
  
      // image png 가져오기
      let images = require.context('../../images', false, /.*\.png$/);
      images.keys().forEach(function (key) {
        if(key.includes('molehole')){
          holeImgs = images(key);
        }
      });

      isImported = true;  // 이미지 가져오기 완료
    }

    // molehole 이미지태그 생성
    this.molehole = new Image();
    this.molehole.src = holeImgs;

    // mole 이미지태그 생성
    this.mole = new Image();

    // gif 프레임을 위한 변수
    this.gifcount = 0;

    // 두더지의 행동을 위한 변수
    this.isClicked = false;

    this.backImg = new Image();
    this.backImg.src = back;
    this.refreshImg = new Image();
    this.refreshImg.src = refresh;
    this.enterImg = new Image();
    this.enterImg.src = enter;
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

  removed(){
    this.isClicked = false;
  }

  showMole() {
    this.isClicked = true;
  }

  hideMole() {
    this.isClicked = false;
  }

  defineRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
  }

  draw(ctx, stageWidth, stageHeight, index) {
    if (this.isClicked) {
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
      
      if (index === 10){
        ctx.fillStyle = '#000';
        ctx.font = `${this.radius}px serif`;
        ctx.fillText('0', this.x - this.radius/2.5, this.y + this.radius/2.5);
      } else if (index === 11){
        ctx.drawImage(this.backImg, this.x - this.radius/2.1, this.y - this.radius/2.3, this.radius, this.radius);
        setTimeout(() => (this.isClicked = false), 300);
      } else if (index === 12) {
        ctx.drawImage(this.refreshImg, this.x - this.radius/2.1, this.y - this.radius/2.3, this.radius, this.radius);
        setTimeout(() => (this.isClicked = false), 300);
      } else if (index === 13) {
        ctx.drawImage(this.enterImg, this.x - this.radius/2.1, this.y - this.radius/2.3, this.radius, this.radius);
        setTimeout(() => (this.isClicked = false), 300);
      } else {
        ctx.fillStyle = '#000';
        ctx.font = `${this.radius}px serif`;
        ctx.fillText(`${this.index}`, this.x - this.radius/2.7, this.y + this.radius/2.7)
      }
    } else {
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#c9c9c9';
      ctx.shadowBlur = stageWidth/40;
      ctx.shadowOffsetY = stageWidth/100 * -1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      if (index === 10){
        ctx.fillStyle = '#000';
        ctx.font = `${this.radius}px serif`;
        ctx.fillText('0', this.x - this.radius/2.5, this.y + this.radius/2.5)
      } else if(index === 11){
        ctx.drawImage(this.backImg, this.x - this.radius/2.1, this.y - this.radius/2.3, this.radius, this.radius)
      } else if (index === 12) {
        ctx.drawImage(this.refreshImg, this.x - this.radius/2.1, this.y - this.radius/2.3, this.radius, this.radius)
      } else if (index === 13) {
        ctx.drawImage(this.enterImg, this.x - this.radius/2.1, this.y - this.radius/2.3, this.radius, this.radius)
      } else {
        ctx.fillStyle = '#000';
        ctx.font = `${this.radius}px serif`;
        ctx.fillText(`${this.index}`, this.x - this.radius/2.7, this.y + this.radius/2.7)
      }
    }
  }

  

  position(stageWidth, stageHeight, index) {
    if(index !== 0){
      if (index < 5) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 1);
        this.y = stageHeight / 1.8;
      } else if (index < 9) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 5);
        this.y = stageHeight / 1.8 + stageHeight / 10;
      } else if (index < 13) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 9);
        this.y = stageHeight / 1.8 + (stageHeight / 10) * 2;
      } else if (index === 13) {
        this.x = stageWidth / 4.9 + (stageWidth / 5) * (index - 10);
        this.y = stageHeight / 1.8 - stageHeight / 10;
      }
    }
  }
}
