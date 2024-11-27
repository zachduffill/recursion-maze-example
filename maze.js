const wall = "#";
const empty = " ";
const start = "S";
const end = "E";

var maze1 = [['#','#','#','#','#','#','#','#'],
            ['#',' ','#',' ','E','#',' ','#'],
            ['#',' ','#',' ','#','#',' ','#'],
            ['#',' ',' ',' ',' ',' ',' ','#'],
            ['#','#','#','#','#',' ','#','#'],
            ['#',' ',' ','#',' ',' ',' ','#'],
            ['#','S',' ',' ',' ','#',' ','#'],
            ['#','#','#','#','#','#','#','#']]

var maze2 = [['#','#','#','#','#','#','#','#','#','#'],
            ['#',' ',' ',' ',' ','#',' ',' ',' ','#'],
            ['#',' ','#','#','#','#',' ','#',' ','#'],
            ['#',' ',' ',' ',' ',' ','#','#',' ','#'],
            ['#',' ',' ','#','#',' ','#','E',' ','#'],
            ['#','#',' ','#',' ',' ','#','#',' ','#'],
            ['#',' ',' ',' ',' ',' ',' ','#',' ','#'],
            ['#',' ','#','#',' ','#',' ','#',' ','#'],
            ['#',' ','S','#',' ','#',' ',' ',' ','#'],
            ['#','#','#','#','#','#','#','#','#','#']]

const dirs = [
    [-1,0],
    [0,1],
    [1,0],
    [0,-1],
];

var grid;
var path;
var seen;

var html_grid;
var grid_size;

$(document).ready(function () {
    html_grid = document.getElementById("maze-grid");

    generate(10,100);
});

function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    maze = maze2;

    for (let r = 0; r < maze.length; r++){
        for (let c = 0; c < maze[r].length; c++){
            var html_cell = html_grid.children[pos_to_idx(maze,[r,c])]

            if (maze[r][c] == wall) {
                html_cell.classList.add("maze-cell-wall");
            }
            else if (maze[r][c] == end) {
                html_cell.classList.add("maze-cell-end");
                html_cell.innerHTML = '<i class="fa-solid fa-person-walking-arrow-right"></i>';
            }
        }
    }
}

///////////////////////////////////

function pos_to_idx(maze, pos){
    return pos[0]*maze[pos[0]].length+pos[1];
}

async function walk(maze, pos){
    if (seen.some(seenPos => seenPos[0] === pos[0] && seenPos[1] === pos[1])) {
        return false; } 
    else {
        seen.push(pos); }

    var html_cell = html_grid.children[await pos_to_idx(maze,pos)]

    path.push(pos);
    if (maze[pos[0]][pos[1]] == " " || maze[pos[0]][pos[1]] == "S"){
        html_cell.classList.add("maze-cell-path");
    }

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
        html_cell.children[0].classList.remove('fa-arrow-up','fa-arrow-right','fa-arrow-down','fa-arrow-left');
        console.log(html_cell.children[0].classList);
        
        if (d[0] == -1) html_cell.children[0].classList.add('fa-arrow-up');
        else if (d[1] == 1) html_cell.children[0].classList.add('fa-arrow-right');
        else if (d[0] == 1) html_cell.children[0].classList.add('fa-arrow-down');
        else if (d[1] == -1) html_cell.children[0].classList.add('fa-arrow-left');

        await sleep(200);
        if (await walk(maze,[pos[0]+d[0],pos[1]+d[1]])){
            return true; 
        }
    }

    path.pop()
    html_cell.classList.remove("maze-cell-path");
    html_cell.children[0].classList.remove('fa-arrow-up','fa-arrow-right','fa-arrow-down','fa-arrow-left');
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

    html_grid.innerHTML = '<div class="maze-cell"><i class="fa-solid"></i></div>'.repeat(grid_size**2);
}

