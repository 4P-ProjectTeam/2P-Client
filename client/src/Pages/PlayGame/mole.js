let molegif = [];
let imgs = [];

export class Mole {
  constructor(stageWidth, stageHeight, radius, index) {
    this.radius = stageWidth / 30;
    this.diameter = this.radius * 2;
    this.position(stageWidth, stageHeight, index);

    // mole png 여러장 가져오기
    let req = require.context('../../images/mole', false, /.*\.png$/);
    req.keys().forEach(function (key) {
      molegif.push(req(key));
    });

    // image png 가져오기
    let images = require.context('../../images', false, /.*\.png$/);
    images.keys().forEach(function (key) {
      imgs.push(images(key));
    });

    // molehole 이미지태그 생성
    this.molehole = new Image();
    this.molehole.src = imgs[5];

    // mole 이미지태그 생성
    this.mole = new Image();

    // gif 프레임을 위한 변수
    this.gifcount = 0;

    // 두더지의 행동을 위한 변수
    this.show = false;
  }

  clicked(mouseX, mouseY, index, ctx) {
    let objToMouseX = Math.pow(this.x - mouseX, 2);
    let objToMouseY = Math.pow(this.y - mouseY, 2);
    let objToMouseResult = Math.sqrt(objToMouseX + objToMouseY); // 거리측정

    if (objToMouseResult < this.diameter) {
      if (this.show) {
        this.show = false;
        this.gifcount = 0; // gif 프레임 초기화
      } else {
        // 나오지 않았지만 클릭한 경우
      }
    }
  }

  showMole() {
    // 두더지가 나옴
    this.show = true;
  }

  draw(ctx, stageWidth, stageHeight) {
    if (this.show) {
      // 두더지가 나온경우
      if (this.gifcount !== 7) this.gifcount += 1; // gif움직임 생성(png를 한장씩 그립니다)
      this.mole.src = molegif[this.gifcount];
      ctx.drawImage(this.mole, this.x - 25, this.y - 25, stageWidth / 10, stageHeight / 5);
    } else {
      ctx.drawImage(this.molehole, this.x - 25, this.y - 25, stageWidth / 10, stageHeight / 5);
    }
  }

  position(stageWidth, stageHeight, index) {
    if (index < 4) {
      this.x = stageWidth / 1.55 - (stageWidth / 9) * index;
      this.y = stageHeight / 7;
    } else if (index < 8) {
      this.x = stageWidth / 1.55 - (stageWidth / 9) * (index - 4);
      this.y = stageHeight / 7 + stageHeight / 5;
    } else if (index < 12) {
      this.x = stageWidth / 1.55 - (stageWidth / 9) * (index - 8);
      this.y = stageHeight / 7 + (stageHeight / 5) * 2;
    } else if (index < 16) {
      this.x = stageWidth / 1.55 - (stageWidth / 9) * (index - 12);
      this.y = stageHeight / 7 + (stageHeight / 5) * 3;
    }
  }
}
