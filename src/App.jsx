import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import generateMaze from './utils/GenerateMaze.jsx';
import dijkstraShortestPath from './utils/shortestPath.jsx';
import './App.css'

const App = () =>{

  const [start,setStart]=useState({x:1,y:1})
  const [end,setEnd]=useState({x:48,y:28})

  const area ={
    x:30,
    y:50
  }


  const [areaGrid,setAreaGrid] = useState([])

  useEffect(()=>{
    function createGrid(){
      
      console.log(start.x,start.y,end.x,end.y)
    let grid = []
    for(let i=0;i<area.y;i++){
      const row = []
      for(let j=0;j<area.x;j++){
        if(i===start.x && j===start.y){
          console.log(i,j)
        }
        row.push({
          x:i,
          y:j,
          isPath:false,
          isWall:i===0 || j===0 || i===area.y-1 || j===area.x-1,
          isStart:i===start.x && j===start.y,
          isEnd:i===end.x && j===end.y,
          isVisited:false,
          previousNode:null,
          distance:Infinity
        })
      }
      grid.push(row)
    }
    setAreaGrid(grid)
  }
  createGrid();
  },[])
  
  const toggleWall=(x,y)=>{
    if((x==start.x && y==start.y) || (x==end.x && y==end.y)){
      return console.error("cant do that")
    }

    if(x===0 || y===0 || x===area.y-1 || y===area.x-1){
      return;
    }
    
    setAreaGrid((prevgrid)=>{
      const newgrid=[...prevgrid];
      const newrow=[...newgrid[x]];
      newrow[y]={...newrow[y],isWall: !newrow[y].isWall}
      newgrid[x]=newrow;
      return newgrid
    })
  }

  const handleFindPath = () => {
    const newGrid = areaGrid.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
      }))
    );
  
    const { path, visitedNodes } = dijkstraShortestPath(newGrid, start, end);
  
    if (path) {
      // Visualize visited nodes and path
      visitedNodes.forEach((node, index) => {
        setTimeout(() => {
          newGrid[node.x][node.y].isVisited = true;
          setAreaGrid([...newGrid]);
        }, 50 * index);
      });
  
      path.forEach((cell, index) => {
        setTimeout(() => {
          newGrid[cell.x][cell.y].isPath = true;
          setAreaGrid([...newGrid]);
        }, 50 * (index));
      });
    } else {
      console.log('No path found');
    }
  };
  
  

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDisabled, Disable] = useState(false);
   const handleMouseDown = (row,col) => {
    if(!isDisabled){
    setIsMouseDown(true);
    toggleWall(row,col);
    }
   }

   const handleMouseUp = (row,col) => {
    if(!isDisabled)
    setIsMouseDown(false);
   }

   const handleMouseEnter = (row,col) => {
    if (isMouseDown && !isDisabled){
      toggleWall(row,col);
    }
   }
    
   const reset=()=>{
    Disable(false)
    let grid = []
    for(let i=0;i<area.y;i++){
      const row = []
      for(let j=0;j<area.x;j++){
        row.push({
          x:i,
          y:j,
          isPath:false,
          isWall:i===0 || j===0 || i===area.y-1 || j===area.x-1,
          isStart:i===start.x && j===start.y,
          isEnd:i===end.x && j===end.y,
          isVisited:false,
          previousNode:null,
          distance:Infinity
        })
      }
      grid.push(row)
    }
    setAreaGrid(grid)
   }

   const func=()=>{
    console.log("clicked")
    
      let grid = generateMaze(areaGrid)
      setAreaGrid(grid)
      handleMouseDown(1,1)
      for(let i=0;i<area.y;i++){
        const row = []
        for(let j=0;j<area.x;j++){
            (i===0 || j===0 || i===area.y-1 || j===area.x-1)?grid[i][j].isWall=true:""        
        }
      }
      Disable(true)
   }

  return (
    <div className='bg-black h-screen'>
      <nav className="bg-slate-900 p-2 px-0 mx-0 mb-0 w-screen">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">PATHFINDING VISUALISER</h1>
        <div className="flex space-x-4">
          <button className="text-white p-3.5 py-0 rounded-full text-center bg-gray-500 focus:outline-none hover:bg-gray-800"
          onClick={()=>func()}
          >Draw Maze <FontAwesomeIcon icon={faPlay}/></button>
          <button className="bg-green-500 text-white px-4 py-2 font-bold rounded-lg hover:bg-green-600"
          onClick={handleFindPath}
          >Find Path</button>
          <button className="bg-red-500 text-white p-3 py-0 rounded-full text-center hover:bg-red-600 focus:outline-none"
          onClick={()=>reset()}
          ><FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
      </div>
    </nav>
    <div className="bg-black flex pt-2 justify-center items-center w-screen">
        
        {areaGrid.map((row,i)=>{
          return(
            
            <div className="row flex flex-col">
              {row.map(col =>{
                return(
                  <div className={`bg- border border-slate-400 w-4 h-4 text-xs \
                    ${col.isStart?'bg-sky-400':""}
                    ${col.isEnd?'bg-green-400':""}
                    ${col.isPath?'bg-green-700':""}
                    ${col.isWall?'bg-slate-500':""}
                    `}
                    onMouseDown={()=>handleMouseDown(col.x,col.y)}
                    onMouseUp={()=>handleMouseUp(col.x,col.y)}
                    onMouseEnter={()=>handleMouseEnter(col.x,col.y)}
                    >
                  
                  </div>
                )
              }

              )}
            </div>
          )
        })}
        
    </div>
  </div>
  )
}

export default App
