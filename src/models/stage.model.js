const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = []; // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, score ,timestamp) => {
  return stages[uuid].push({ id, score ,timestamp }); // scorePerSecond 추가
};

export const initializeStages = (uuid) => {
  stages[uuid] = [];
};

export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};