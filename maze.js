const wall = "#";
const empty = "-";
const start = "S";
const end = "E";

$(document).ready(function () {
    setGridSize(7);
});

function generate(size){
    let arr = new Array();

    for (let i = 1; i < size-1; ++i){

    } // you might also need to use recursive funcs for generating valid mazes
}

function setGridSize(size){
    let grid = document.getElementById("maze-grid");
    grid.style.gridTemplateRows = "repeat("+size+", 50px)"
    grid.style.gridTemplateColumns = "repeat("+size+", 50px)"

    grid.innerHTML = '<div class="maze-node"></div>'.repeat(size**2);
}

