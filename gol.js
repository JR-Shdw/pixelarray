//pixelarray.js required
//l'objet tableau du jeu de la vie

"use-strict";

var Gamedata = {};
var canvasName = "#gameOfLife";
Gamedata.width = parseInt($(canvasName).width());
Gamedata.length = parseInt($(canvasName).height());
Gamedata.table = [[]];
Gamedata.copy = [[]];
Gamedata.deadNeighbors = 3;
Gamedata.liveNeighbors = [2, 3];
Gamedata.pointer={"x" : 0 , "y" : 0 };
Gamedata.turn = 0;
Gamedata.transp = 1;


function GamedataTableInit() {
    for (var i = 0; i < Gamedata.width ; i++) {
        Gamedata.table[i] = [];
        Gamedata.copy[i] = [];
        for (var j = 0; j < Gamedata.length ; j++) {
            Gamedata.table[i][j] = 0;
            Gamedata.copy[i][j] = 0;
        }
    }
}


function drawxPixelRandomPos(x) {

    for (var i = 0; i < x; i++)
    {
        do {
            do {
                var posX = parseInt(Math.random() * Gamedata.width);
            }
            while ((posX % Pixeldata.pixelSize) !== 0);

            do {
                var posY = parseInt(Math.random() * Gamedata.length);
            }
            while ((posY % Pixeldata.pixelSize) !== 0);
        }
        while (Gamedata.table[posX] !== undefined && Gamedata.table[posX][posY] !== undefined && (Gamedata.table[posX][posY] === 1));

        Gamedata.table[posX][posY] = 1;
        Gamedata.copy[posX][posX] = 1;
        drawCanvasColorT(canvasName,posX,posY, 0,0,0, Gamedata.transp);
    }
}

function drawxPixelRdmColorRdmpos(x) {
    for (var i = 0; i < x; i++)
    {
        do {
            do {
                var posX = parseInt(Math.random() * Gamedata.width);
            }
            while ((posX % Pixeldata.pixelSize) !== 0);

            do {
                var posY = parseInt(Math.random() * Gamedata.length);
            }
            while ((posY % Pixeldata.pixelSize) !== 0);
        }
        while (Gamedata.table[posX] !== undefined && Gamedata.table[posX][posY] !== undefined && (Gamedata.table[posX][posY] === 1));

        Gamedata.table[posX][posY] = 1;
        Gamedata.copy[posX][posX] = 1;
        drawPixelToCanvasRdmColor(canvasName, posX, posY, Gamedata.transp);
    }
}


function cellState(x, y)
{
    return Gamedata.table[x][y];
}

function applyRules(celldata, neighbors)
{
    var cell = 0;
    if (celldata === 1)
    {
        if ((neighbors === 2) || (neighbors === 3))
        {
            cell = 1;
        }
        else
        {
            cell= 0;
        }
    }
    else if (celldata === 0)
    {
        if(neighbors === 3)
        {
            cell = 1;
        }
        else
        {
            cell = 0;
        }
    }
    return cell
}

function moveRight(){
Gamedata.pointer.x += Pixeldata.pixelSize;
    if (Gamedata.pointer.x > (Gamedata.width-1)){
        Gamedata.pointer.x = 0;
    }
}

function moveLeft(){
    Gamedata.pointer.x -= Pixeldata.pixelSize;
    if (Gamedata.pointer.x < 0){
        Gamedata.pointer.x = (Gamedata.width - Pixeldata.pixelSize);
    }
}

function moveUp(){
    Gamedata.pointer.y -= Pixeldata.pixelSize;
    if (Gamedata.pointer.y < 0){
        Gamedata.pointer.y = (Gamedata.length - Pixeldata.pixelSize);
    }
}

function moveDown(){
    Gamedata.pointer.y += Pixeldata.pixelSize;
    if (Gamedata.pointer.y > (Gamedata.length - 1)){
        Gamedata.pointer.y = 0;
    }
}

function countNeighbors( x , y)
{
        var neighbor = 0;
        Gamedata.pointer.x = x;
        Gamedata.pointer.y = y;

        moveUp();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
            neighbor++;
        }

        moveRight();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
             neighbor++;
        }

        moveDown();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
            neighbor++;
        }
        moveDown();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
            neighbor++;
        }
        moveLeft();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
            neighbor++;
        }
        moveLeft();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
            neighbor++;
        }
        moveUp();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
            neighbor++;
        }

        moveUp();

        if (Gamedata.table[Gamedata.pointer.x][Gamedata.pointer.y] === 1)
        {
            neighbor++;
        }

    return neighbor;
}

//j'initialize la table a 0
GamedataTableInit();
//on place des celules au hasard
drawxPixelRandomPos(400);
//je lance la simulation

function array_copy(array1 , array2) {
    for (var i = 0; i < Gamedata.width; i += Pixeldata.pixelSize) {
        for (var j = 0; j < Gamedata.length; j += Pixeldata.pixelSize) {
            array2[i][j] = array1[i][j];
        }
    }
}

function table1Draw() {

    array_copy(Gamedata.table,Gamedata.copy );

    for (var i = 0; i < Gamedata.width ; i += Pixeldata.pixelSize) {
        for (var j = 0; j < Gamedata.length; j += Pixeldata.pixelSize) {
            var cell = cellState(i, j);
            var neighbors = countNeighbors(i, j);

            cell = applyRules(cell, neighbors);
            Gamedata.copy[i][j] = cell;
            if (cell === 1 ) {
                drawPixelToCanvas(canvasName, i, j, 0,0,0, Gamedata.transp);
            }
            else if(cell === 0)
            {
                drawPixelToCanvas(canvasName, i, j, 255,255,255, Gamedata.transp);
            }

        }
    }

    array_copy(Gamedata.copy,Gamedata.table);
}

function gol()
{
        table1Draw();
        Gamedata.turn ++;
}


//canvasName.requestAnimationFrame

function repeat() {
    gol();
    requestAnimationFrame(repeat);
}


$(function (){
    repeat();
});

