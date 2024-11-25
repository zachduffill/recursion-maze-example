const wall = "#";
const empty = " ";
const start = "S";
const end = "E";

var maze1 = [['#','#','#','#','#','#','#','#'],
            ['#',' ','#',' ','E','#',' ','#'],
            ['#',' ','#',' ','#','#',' ','#'],
            ['#',' ',' ',' ','#',' ',' ','#'],
            ['#','#',' ','#','#',' ','#','#'],
            ['#',' ',' ','#',' ',' ',' ','#'],
            ['#','S',' ',' ',' ','#',' ','#'],
            ['#','#','#','#','#','#','#','#']]

const dirs = [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0],
];

var grid;
var path;
var seen;

var html_grid;
var grid_size;

$(document).ready(function () {
    html_grid = document.getElementById("maze-grid");

    generate(8,100);
});

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function getCellType(pos){
    return grid[pos.y][pos.x];
}

function posToHtmlCell(pos){
    let index = pos.x + pos.y*grid_size;
    return html_grid.children[index];
}

//////////////////////////////////

// async function gen_walk(pos, anim_speed=0){
//     if (pos.x < 0 || pos.y < 0){
//         return false;
//     }
//     if (pos.x >= grid_size || pos.y >= grid_size){
//         return false;
//     }
//     if (seen[pos.x][pos.y]){
//         return false;
//     }

//     seen[pos.x][pos.y] = true;
//     posToHtmlCell(pos).style.backgroundColor = "blue";

//     for (let d of dir){
//         await sleep(anim_speed);
//         console.log(d);
//         if (await gen_walk({x:pos.x+d[0], y:pos.y+d[1]}, anim_speed)){
//             return true;
//         }
//     }
// }

function generate(size, anim_speed=0){
    setGridSize(size);

    // grid = Array.from({ length: size }, () => new Array(size).fill(""));
    // seen = Array.from({ length: size }, () => new Array(size).fill(false));

    // if (gen_walk({x:0, y:0}, anim_speed)){
    //     console.log("done");
    // }

    maze = maze1;

    for (let r = 0; r < maze.length; r++){
        for (let c = 0; c < maze[r].length; c++){
            var bgClass;
            const cell = JSON.stringify(maze[r][c]);
            if (maze[r][c] == wall) {
                bgClass = "maze-cell-wall";
            }
            else if (maze[r][c] == end) {
                bgClass = "maze-cell-end";
                html_grid.children[r*maze[r].length+c].innerHTML = '<i class="fa-solid fa-person-walking-arrow-right"></i>';
            }
            else {
                bgClass = null;
            }

            if (bgClass) html_grid.children[r*maze[r].length+c].classList.add(bgClass);
        }
    }
}

///////////////////////////////////

function walk(maze, pos){
    if (seen.some(seenPos => seenPos[0] === pos[0] && seenPos[1] === pos[1])) {
        return false; } 
    else {
        seen.push(pos); }

    path.push(pos);

    if (pos[1] < 0 || pos[1] >= maze[0].length || pos[0] < 0 || pos[0] >= maze.length){
        path.pop();
        return false;
    }
    if (maze[pos[0]][pos[1]] == "#"){
        path.pop()
        return false;
    }
    if (maze[pos[0]][pos[1]] == "E"){
        return true;
    }

    for (const d of dirs){
        if (walk(maze,[pos[0]+d[1],pos[1]+d[0]])){
            return true; 
        }
    }

    path.pop()
    return false
}

function solve(maze){
    path = [];
    seen = [];
    for (let r = 0; r < maze.length; r++){
        for (let c = 0; c < maze[r].length; c++){
            if (maze[r][c] == "S"){
                walk(maze,[r,c])
                break
            }
        }
    }
    console.log(path);
}

function setGridSize(size){
    grid_size = size;
    html_grid.style.gridTemplateRows = "repeat("+grid_size+", 50px)"
    html_grid.style.gridTemplateColumns = "repeat("+grid_size+", 50px)"

    html_grid.innerHTML = '<div class="maze-cell"></div>'.repeat(grid_size**2);
}

