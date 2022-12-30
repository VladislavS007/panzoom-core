import React, { useEffect, useRef, useState } from 'react';

import PanZoom, { Element } from './PanZoom';

type Elements = {
  puzzle: {
    x: number,
    y: number,
  }
}

export default { title: 'Puzzles' };

export const Puzzles = () => {
  const timeRef = useRef<NodeJS.Timeout>();
  const [connected, setConnected] = useState(false);
  const [puzzleExists, setPuzzleExists] = useState(true);

  useEffect(() => () => clearTimeout(timeRef.current), []);

  const onElementsChange = (elements: Elements) => {
    const { puzzle } = elements;
    if (!puzzle) return;

    if (puzzle.x >= 85 && puzzle.x <= 101 && puzzle.y >= 7 && puzzle.y <= 23) {
      setConnected(true);
      timeRef.current = setTimeout(() => {
        setPuzzleExists(false);
      }, 500);
    }
  };

  return (
    <div style={{ border: '1px dashed #000', width: 400, height: 400 }}>
      <PanZoom
        disabledUserSelect
        onElementsChange={onElementsChange}
      >
        <Element id="heart" disabled={puzzleExists}>
          <img
            style={{
              opacity: connected ? 1 : 0.5,
              transition: 'all 1s',
              width: 180,
            }}
            src={
              connected
                ? 'https://raw.githubusercontent.com/sasza2/react-panzoom/master/docs/heart/heart_all.png'
                : 'https://raw.githubusercontent.com/sasza2/react-panzoom/master/docs/heart/heart_missing.png'
            }
            alt="heart missing"
          />
        </Element>
        {
          puzzleExists && (
            <Element id="puzzle" x={250} y={250}>
              <img style={{ width: 68 }} src="https://raw.githubusercontent.com/sasza2/react-panzoom/master/docs/heart/heart_puzzle.png" alt="puzzle" />
            </Element>
          )
        }
      </PanZoom>
    </div>
  );
};
