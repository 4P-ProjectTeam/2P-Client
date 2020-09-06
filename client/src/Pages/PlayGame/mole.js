import { keys } from "@material-ui/core/styles/createBreakpoints";

let molegif = [];
let holeImgs;
let isImported = false;

export class Mole {
  constructor(stageWidth, stageHeight, radius, index) {
    this.radius = stageWidth / 30;
    this.diameter = this.radius * 2;
    this.position(stageWidth, stageHeight, index);

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
    this.show = false;

    
  }

  clicked(mouseX, mouseY, index, ctx) {
    let objX = this.x + this.radius * 3
    let objY = this.y + this.radius * 3
    let objToMouseX = Math.pow(objX - mouseX, 2);
    let objToMouseY = Math.pow(objY - mouseY, 2);
    let objToMouseResult = Math.sqrt(objToMouseX + objToMouseY); // 거리측정
    if (objToMouseResult < this.diameter) {
      if (this.show) {
        this.show = false;
        this.gifcount = 0; // gif 프레임 초기화
        return index;
      } else {
        // 나오지 않았지만 클릭한 경우
      }
    }
  }

  generateMole() {
    // 두더지가 나옴
    this.show = true;
    let randomTime = Math.floor(Math.random() * 3);
    console.log('randomTime: ', randomTime);
    setTimeout(() => {
      this.show = false;
    }, 2500);
  }

  showMole(){
    this.show = true;
  }

  hideMole() {
    if (this.show === true) {
      this.show = false;
      return true;
    }
  }

  draw(ctx, stageWidth, stageHeight) {
    if (this.show) {
      // 두더지가 나온경우
      if (this.gifcount !== 7) this.gifcount += 1; // gif움직임 생성(png를 한장씩 그립니다)
      this.mole.src = molegif[this.gifcount];
      ctx.drawImage(this.mole, this.x, this.y, stageWidth / 5, stageHeight / 5);
    } else {
      ctx.drawImage(this.molehole, this.x, this.y, stageWidth / 5, stageHeight / 5);
    }
  }

  position(stageWidth, stageHeight, index) {
    if (index < 4) {
      this.x = stageWidth / 1.35 - (stageWidth / 4.5) * index;
      this.y = stageHeight / 11;
    } else if (index < 8) {
      this.x = stageWidth / 1.35 - (stageWidth / 4.5) * (index - 4);
      this.y = stageHeight / 11 + stageHeight / 5;
    } else if (index < 12) {
      this.x = stageWidth / 1.35 - (stageWidth / 4.5) * (index - 8);
      this.y = stageHeight / 11 + (stageHeight / 5) * 2;
    } else if (index < 16) {
      this.x = stageWidth / 1.35 - (stageWidth / 4.5) * (index - 12);
      this.y = stageHeight / 11 + (stageHeight / 5) * 3;
    }
  }
}
