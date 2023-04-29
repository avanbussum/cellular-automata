import React, { useState, useCallback, useRef } from 'react'
import Produce from 'immer';

const numRows = 30;
const numCols = 40;

let rps = false;

// const cell = {alive: 0, type: 0, color: ''};
//const deadcell = {dead: 0, type: 0, color: ''};


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
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => { const cell = { alive: 0, type: '', color: 'purple' }; return (cell) }
    ))
  }
  console.log(rows.join(rows.type))
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
            neighborCoordinates.forEach(([a, b]) => {
              const newX = x + a;
              const newY = y + b;

              if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
                neighbors += grid[newX][newY].alive
              }
            })

            // "game of life - rules"

            // if (neighbors < 2 || neighbors > 3) {
            //   gridCopy[x][y].alive = 0;
            // } else if (grid[x][y].alive === 0 && neighbors === 3) {
            //   gridCopy[x][y].alive = 1; 
            // }

            //"seeds"

            // if (grid[x][y].alive === 1 && neighbors === 2) {
            //   gridCopy[x][y].alive = 1; 
            // } else if (grid[x][y].alive === 0 && neighbors === 2) {
            //   gridCopy[x][y].alive = 1;
            // } else {
            //   gridCopy[x][y].alive = 0;
            // }

            // "RPS"
            rps = true
            let r = 0;
            let p = 0;
            let s = 0;
            console.log(s)

            neighborCoordinates.forEach(([a, b]) => {
              const newX = x + a;
              const newY = y + b;

              if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
                if (grid[newX][newY].type === 'scissors') s++;
                if (grid[newX][newY].type === 'rock') r++;
                if (grid[newX][newY].type === 'paper') p++;
              }
            })

            let cur = grid[x][y];
            if (cur.alive) {
              switch (cur.type) {
                case 'rock':
                  if (p>2) {
                    gridCopy[x][y].type = 'paper';
                    gridCopy[x][y].color = 'green';
                  }
                break;

                case 'paper':
                  
                  if (s>2) {
                    gridCopy[x][y].type = 'scissors';
                    gridCopy[x][y].color = 'red';
                  }
                break;

                case 'scissors':
                  if (r>2) {
                    gridCopy[x][y].type = 'rock';
                    gridCopy[x][y].color = 'blue';
                  }
                break;
              }
            }



          }
        }
      });
    });


    setTimeout(runSimulation, 0.1);
  }, []);




  return (
    <>
    <p>First click start, then randomize until a pattern works</p>
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
              Array.from(Array(numCols), () => {
                const cell = { alive: 0, type: '', color: 'purple' };
                let prob = 0.4;
                if (rps === true) prob = 1
                if (Math.random() < prob) {
                  cell.alive = 1;
                }
                else {
                  cell.alive = 0;
                }

                if (rps === true) {
                  if (Math.random() < 1 / 3) {
                    cell.type = 'rock';
                    cell.color = 'blue'
                  }
                  else if (Math.random() > 2 / 3) {
                    cell.type = 'paper';
                    cell.color = 'green'

                  }
                  else {
                    cell.type = 'scissors';
                    cell.color = 'red'
                  }
                }

                return cell;
              })
            );
          }
          console.log(rows)
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
          columnGap: '15px',
          justifyContent: 'center',
          marginBottom: '15px',
        }}
      >
        {grid.map((rows, x) =>
          rows.map((col, y) => (
            <div
              onClick={() => {
                const newGrid = Produce(grid, (gridCopy) => {
                  gridCopy[x][y].alive = grid[x][y].alive ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              key={`${x}-${y}`}
              style={{
                width: 15,
                height: 15,
                backgroundColor: grid[x][y].alive ? grid[x][y].color : 'gray',
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
