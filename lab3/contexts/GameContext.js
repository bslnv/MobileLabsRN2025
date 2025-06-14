import React, { createContext, useState, useEffect, useCallback } from 'react';

const initialTasksData = [
  { id: '1', text: 'Зробити 10 кліків', completed: false, target: 10, progress: 0, type: 'singleTap' },
  { id: '2', text: 'Зробити подвійний клік 5 разів', completed: false, target: 5, progress: 0, type: 'doubleTap' },
  { id: '3', text: 'Утримувати об\'єкт 3 секунди', completed: false, target: 3000, progress: 0, type: 'longPressDuration' },
  { id: '4', text: 'Перетягнути об\'єкт', completed: false, type: 'pan' },
  { id: '5', text: 'Зробити свайп вправо', completed: false, type: 'flingRight' },
  { id: '6', text: 'Зробити свайп вліво', completed: false, type: 'flingLeft' },
  { id: '7', text: 'Змінити розмір об\'єкта', completed: false, type: 'pinch' },
  { id: '8', text: 'Отримати 100 очок', completed: false, target: 100, progress: 0, type: 'score' },
];

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [tasks, setTasks] = useState(initialTasksData);
  
  const [singleTapCount, setSingleTapCount] = useState(0);
  const [doubleTapCount, setDoubleTapCount] = useState(0);
  const [lastLongPressDuration, setLastLongPressDuration] = useState(0);
  
  const [panPerformed, setPanPerformed] = useState(false);
  const [flingRightPerformed, setFlingRightPerformed] = useState(false);
  const [flingLeftPerformed, setFlingLeftPerformed] = useState(false);
  const [pinchPerformed, setPinchPerformed] = useState(false);

  const updateScore = useCallback((points) => {
    setScore(prevScore => prevScore + points);
  }, []);

  const recordSingleTap = useCallback(() => {
    setSingleTapCount(prev => prev + 1);
    updateScore(1);
  }, [updateScore]);

  const recordDoubleTap = useCallback(() => {
    setDoubleTapCount(prev => prev + 1);
    updateScore(2);
  }, [updateScore]);

  const recordLongPress = useCallback((points, duration) => {
    if (points > 0) {
      updateScore(points);
    }
    if (duration > 0) {
     setLastLongPressDuration(prevDuration => Math.max(prevDuration, duration));
    }
  }, [updateScore]);

  const recordPan = useCallback(() => {
    setPanPerformed(true);
  }, []);

  const recordFlingRight = useCallback((points) => {
    setFlingRightPerformed(true);
    updateScore(points);
  }, [updateScore]);

  const recordFlingLeft = useCallback((points) => {
    setFlingLeftPerformed(true);
    updateScore(points);
  }, [updateScore]);

  const recordPinch = useCallback((points) => {
    setPinchPerformed(true);
    updateScore(points);
  }, [updateScore]);

  useEffect(() => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.completed) return task;
        let newProgress = task.progress;
        let isCompleted = false;

        switch (task.type) {
          case 'singleTap':
            newProgress = singleTapCount;
            if (newProgress >= task.target) isCompleted = true;
            break;
          case 'doubleTap':
            newProgress = doubleTapCount;
            if (newProgress >= task.target) isCompleted = true;
            break;
          case 'longPressDuration':
            if (lastLongPressDuration >= task.target) {
                isCompleted = true;
                newProgress = task.target;
            } else {
                newProgress = lastLongPressDuration;
            }
            break;
          case 'score':
            newProgress = score;
            if (newProgress >= task.target) isCompleted = true;
            break;
          case 'pan':
            if (panPerformed) isCompleted = true;
            break;
          case 'flingRight':
            if (flingRightPerformed) isCompleted = true;
            break;
          case 'flingLeft':
            if (flingLeftPerformed) isCompleted = true;
            break;
          case 'pinch':
            if (pinchPerformed) isCompleted = true;
            break;
          default:
            return task;
        }
        if (isCompleted) newProgress = task.target !== undefined ? task.target : 1;
        return { ...task, progress: newProgress, completed: isCompleted };
      })
    );
  }, [score, singleTapCount, doubleTapCount, lastLongPressDuration, panPerformed, flingRightPerformed, flingLeftPerformed, pinchPerformed]);

  return (
    <GameContext.Provider
      value={{
        score,
        tasks,
        recordSingleTap,
        recordDoubleTap,
        recordLongPress,
        recordPan,
        recordFlingRight,
        recordFlingLeft,
        recordPinch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};