// SPDX-License-Identifier: MIT
//pixelarray.js required
//l'objet tableau du jeu de la vie

"use strict";

var Gamedata = {};
var canvasName = "#gameOfLife";

function initGamedata() {
	var canvasEl = document.getElementById("gameOfLife");
	Gamedata.width = canvasEl.width;
	Gamedata.length = canvasEl.height;
	Gamedata.table = [[]];
	Gamedata.copy = [[]];
	Gamedata.deadNeighbors = 3;
	Gamedata.liveNeighbors = [2, 3];
	Gamedata.turn = 0;
	Gamedata.transp = 1;
}


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
		// FIX: posY au lieu de posX pour le deuxieme index
		Gamedata.copy[posX][posY] = 1;
		drawCanvasColorT(canvasName, posX, posY, 0, 0, 0, Gamedata.transp);
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
		// FIX: posY au lieu de posX pour le deuxieme index
		Gamedata.copy[posX][posY] = 1;
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
			cell = 0;
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
	return cell;
}

// FIX: countNeighbors reecrit avec des variables locales
// au lieu du pointeur global Gamedata.pointer qui corrompait le comptage
function countNeighbors(x, y)
{
	var neighbor = 0;
	var ps = Pixeldata.pixelSize;
	var w = Gamedata.width;
	var h = Gamedata.length;

	// les 8 directions : [dx, dy]
	var dirs = [
		[0, -ps],    // haut
		[ps, -ps],   // haut-droite
		[ps, 0],     // droite
		[ps, ps],    // bas-droite
		[0, ps],     // bas
		[-ps, ps],   // bas-gauche
		[-ps, 0],    // gauche
		[-ps, -ps]   // haut-gauche
	];

	for (var d = 0; d < dirs.length; d++) {
		// wrapping toroidal
		var nx = ((x + dirs[d][0]) % w + w) % w;
		var ny = ((y + dirs[d][1]) % h + h) % h;
		if (Gamedata.table[nx][ny] === 1) {
			neighbor++;
		}
	}

	return neighbor;
}


function array_copy(array1, array2) {
	for (var i = 0; i < Gamedata.width; i += Pixeldata.pixelSize) {
		for (var j = 0; j < Gamedata.length; j += Pixeldata.pixelSize) {
			array2[i][j] = array1[i][j];
		}
	}
}

function table1Draw() {

	array_copy(Gamedata.table, Gamedata.copy);

	for (var i = 0; i < Gamedata.width ; i += Pixeldata.pixelSize) {
		for (var j = 0; j < Gamedata.length; j += Pixeldata.pixelSize) {
			var cell = cellState(i, j);
			var neighbors = countNeighbors(i, j);

			cell = applyRules(cell, neighbors);
			Gamedata.copy[i][j] = cell;
			if (cell === 1) {
				drawPixelToCanvas(canvasName, i, j, 0, 0, 0, Gamedata.transp);
			}
			else if(cell === 0)
			{
				drawPixelToCanvas(canvasName, i, j, 255, 255, 255, Gamedata.transp);
			}
		}
	}

	array_copy(Gamedata.copy, Gamedata.table);
}

function gol()
{
	table1Draw();
	Gamedata.turn++;
}


function repeat() {
	gol();
	requestAnimationFrame(repeat);
}


window.addEventListener('DOMContentLoaded', function() {
	// init pixeldata
	pixelDataCreate(4, 0, 0, 0, 0, 0);
	// init gamedata depuis le canvas
	initGamedata();
	// init la grille a 0
	GamedataTableInit();
	// placer des cellules au hasard
	drawxPixelRandomPos(400);
	// lancer la simulation
	repeat();
});
