import React, {useState, useCallback, useRef} from 'react'
import Produce from 'immer';

const numRows = 20;
const numCols = 20;

const rock = {alive: 1, color: "red"};

const neighborCoordinates = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
  [1, 0]
]

const resetGrid = () => {
  const rows = [];
  for (let i=0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows;
}

export const App = () => {
  const [grid, setGrid] = useState(() => {
    return resetGrid()
  });

  const [running, setRunning] = useState(false)

  const runningRef = useRef(running);
  runningRef.current = running
  
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((grid) => {
      return Produce(grid, gridCopy => {
        for (let x = 0; x < numRows; x++) {
          for (let y = 0; y < numCols; y++) {
            let neighbors = 0;
            neighborCoordinates.forEach(([a,b]) => {
              const newX = x + a;
              const newY = y + b;
              if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
                neighbors += grid[newX][newY]
              }
            })

            // "game of life - rules"
            // if (neighbors < 2 || neighbors > 3) {
            //   gridCopy[x][y] = 0;
            // } else if (grid[x][y] === 0 && neighbors === 3) {
            //   gridCopy[x][y] = 1; 
            // }

            // "seeds"
            if (grid[x][y] === 1 && neighbors === 2) {
              gridCopy[x][y] = 1; 
            } else if (grid[x][y] === 0 && neighbors === 2) {
              gridCopy [x][y] = 1;
            } else {
              gridCopy[x][y] = 0;
            }

            // "wireworld"

          }
        }
      });
    });


    setTimeout(runSimulation, 100);
  }, []);

  


  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => setGrid(resetGrid())}>Clear</button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() < 0.5 ? 1 : 0))
            );
          }
          setGrid(rows);
        }}
      >
        Randomize
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 10px)`,
          rowGap: '5px',
          columnGap:'15px',
          justifyContent: 'center',
        }}
      >
        {grid.map((rows, x) =>
          rows.map((col, y) => (
            <div
              onClick={() => {
                const newGrid = Produce(grid, (gridCopy) => {
                  gridCopy[x][y] = grid[x][y] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              key={`${x}-${y}`}
              style={{
                width: 15,
                height: 15,
                backgroundColor: grid[x][y] ? 'purple' : 'gray',
                border: 'solid 2px black',
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
