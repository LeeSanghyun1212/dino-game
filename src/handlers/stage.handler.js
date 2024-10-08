import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) * currentStage.scorePerSecond / 1000; // 초 단위로 계산
  // 현재 스테이지의 초당 점수를 사용하여 예상 점수 계산
  const expectedScore = elapsedTime * currentStage.scorePerSecond;
  
  // 100점 이상 도달 시 다음 스테이지로 이동, 오차범위 5
  // 클라이언트와 서버 간의 통신 지연시간을 고려해서 오차범위 설정
  if (expectedScore < 100 || expectedScore > 105) {
    return { status: 'fail', message: 'Invalid score for stage advancement' };
  }

  // 게임 에셋에서 다음 스테이지의 존재 여부 확인
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage does not exist' };
  }

  // 유저의 다음 스테이지 정보 업데이트
  setStage(userId, payload.targetStage);
  return { status: 'success',  };
};
