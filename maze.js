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

var html_code;
var last_idx_highlighted;

var anim_speed = 200;

$(document).ready(function () {
    html_grid = document.getElementById("maze-grid");
    html_code = document.getElementById("code");

    generate(10);
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

function generate(size){
    setGridSize(size);

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

async function highlight_code(idx){
    if (last_idx_highlighted) html_code.children[last_idx_highlighted].classList.remove("code-currentline");
    html_code.children[idx].classList.add("code-currentline");
    last_idx_highlighted = idx;
    await sleep(anim_speed);
}

async function walk(maze, pos){
    var html_cell = html_grid.children[await pos_to_idx(maze,pos)];
    html_cell.classList.add("current-cell");

    await highlight_code(1);
    if (seen.some(seenPos => seenPos[0] === pos[0] && seenPos[1] === pos[1])) {
        await highlight_code(2);
        html_cell.classList.remove("current-cell");
        return false; 
    } 
    else {
        await highlight_code(3);
        await highlight_code(4);
        await highlight_code(5);
        seen.push(pos); 
    }

    path.push(pos);
    if (maze[pos[0]][pos[1]] == " " || maze[pos[0]][pos[1]] == "S"){
        html_cell.classList.add("maze-cell-path");
    }

    await highlight_code(7);
    if (pos[1] < 0 || pos[1] >= maze[0].length || pos[0] < 0 || pos[0] >= maze.length){
        await highlight_code(8);
        path.pop();
        await highlight_code(9);
        html_cell.classList.remove("current-cell");
        return false;
    }
    await highlight_code(11);
    if (maze[pos[0]][pos[1]] == "#"){
        await highlight_code(12);
        path.pop()
        await highlight_code(13);
        html_cell.classList.remove("current-cell");
        return false;
    }
    await highlight_code(15);
    if (maze[pos[0]][pos[1]] == "E"){
        await highlight_code(16);
        return true;
    }

    await highlight_code(18);
    for (const d of dirs){
        html_cell.children[0].classList.remove('fa-arrow-up','fa-arrow-right','fa-arrow-down','fa-arrow-left');
        
        if (d[0] == -1) html_cell.children[0].classList.add('fa-arrow-up');
        else if (d[1] == 1) html_cell.children[0].classList.add('fa-arrow-right');
        else if (d[0] == 1) html_cell.children[0].classList.add('fa-arrow-down');
        else if (d[1] == -1) html_cell.children[0].classList.add('fa-arrow-left');

        await highlight_code(19);
        html_cell.classList.remove("current-cell");
        if (await walk(maze,[pos[0]+d[0],pos[1]+d[1]])){
            await highlight_code(20);
            return true; 
        }
    }

    await highlight_code(22);
    path.pop()
    html_cell.classList.remove("maze-cell-path");
    html_cell.children[0].classList.remove('fa-arrow-up','fa-arrow-right','fa-arrow-down','fa-arrow-left');
    await highlight_code(23);
    html_cell.classList.remove("current-cell");
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

