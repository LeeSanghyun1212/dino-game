import './Socket.js';
import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  scoresPerSecond = 1;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStage = 1000;
  stageChanged = {};

  constructor(ctx, scaleRatio, stageTable) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable;
    this.unlockedItems = new Set();
  }

  increaseScore(value) {
    this.currentScore += value;
    this.checkStageChange();
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scoresPerSecond;
    this.checkStageChange();
  }
  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];
      if (
        Math.floor(this.score) >= stage.score &&
        !this.stageChanged[stage.id] &&
        stage.id !== 1000
      ) {
        const pastStage = this.currentStage;
        this.currentStage = stage.id;
        this.scoresPerSecond = stage.scoresPerSecond;
        this.stageChanged[stage.id] = true;
        sendEvent(11, { 
          currentStage: pastStage, 
          targetStage: this.currentStage, 
          targetPerSecond : this.scoresPerSecond 
        });
        break;
      }
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
    this.scoresPerSecond = 1;
    this.currentStage = 1000;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.drawStage();
  }
  drawStage() {
    const stageY = 20 * this.scaleRatio;
    const fontSize = 30 * this.scaleRatio;

    const stageText = `Stage ${this.currentStage - 999  }`; // 스테이지 번호 계산
    const stageX = 20;

    this.ctx.fillText(stageText, stageX, stageY);
  }
}

export default Score;
