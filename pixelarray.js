/***** bibliotheque pour recuperer la taille d'une DIV de ID pixelArray *****/
/*****Structure *****/

"use strict";

var Pixeldata = {};
var PixelCanvas = [[]];
Pixeldata.pixelSize = 7;


function pixelDataCreate(size, red, green, blue, posX, posY)
{
	Pixeldata.pixelSize = size;
	Pixeldata.blue = blue;
	Pixeldata.red = red;
	Pixeldata.green = green;
	Pixeldata.posX = posX;
	Pixeldata.posY = posY;
	return Pixeldata;
}

function drawPixel(canvasId, Pixeldata)
{
	var canvas = document.getElementById(canvasId);
	if (canvas.getContext){
		var context = canvas.getContext('2d');
		context.fillStyle = 'rgb('+Pixeldata.red+','+Pixeldata.green+','+Pixeldata.blue+')';
		context.fillRect(Pixeldata.posX, Pixeldata.posY, Pixeldata.pixelSize, Pixeldata.pixelSize);
	}
}


function drawRect(canvasId, Pixeldata, Xsize, Ysize){
	var canvas = document.getElementById(canvasId);
	if (canvas.getContext){
		var context = canvas.getContext('2d');
		context.fillStyle = 'rgb('+Pixeldata.red+','+Pixeldata.green+','+Pixeldata.blue+')';
		context.fillRect(Pixeldata.posX, Pixeldata.posY, Xsize, Ysize);
	}
}

function drawPixelT(canvasId, Pixeldata){
	var canvas = document.getElementById(canvasId);
	if (canvas.getContext){
		var context = canvas.getContext('2d');
		context.fillStyle= 'rgba('+Pixeldata.red+ ',' +Pixeldata.green+','+Pixeldata.blue+','+Pixeldata.transp+')';
		context.fillRect(Pixeldata.posX, Pixeldata.posY, Pixeldata.pixelSize, Pixeldata.pixelSize);
	}
}


// FIX: utilise le parametre PixeldataT au lieu du global
function drawRectT(canvasId, PixeldataT, Xsize, Ysize){
	var canvas = document.getElementById(canvasId);
	if (canvas.getContext){
		var context = canvas.getContext('2d');
		context.fillStyle= 'rgba('+PixeldataT.red+ ',' +PixeldataT.green+','+PixeldataT.blue+','+PixeldataT.transp+')';
		context.fillRect(PixeldataT.posX, PixeldataT.posY, Xsize, Ysize);
	}
}

function drawRandom(canvasName)
{
	Pixeldata.red = parseInt(Math.random()*255);
	Pixeldata.green = parseInt(Math.random()*255);
	Pixeldata.blue = parseInt(Math.random()*255);
	Pixeldata.pixelSize = 4;
	var canvasId = canvasName.substring(1);
	var canvasEl = document.getElementById(canvasId);
	var divWidth = canvasEl.width;
	var divLength = canvasEl.height;

	do {
		do {
			Pixeldata.posX = parseInt(Math.random() * divWidth);
		}
		while ((Pixeldata.posX % Pixeldata.pixelSize) !== 0);

		do {
			Pixeldata.posY = parseInt(Math.random() * divLength);
		}
		while ((Pixeldata.posY % Pixeldata.pixelSize) !== 0);
	}
	while (PixelCanvas[Pixeldata.posX] !== undefined && PixelCanvas[Pixeldata.posX][Pixeldata.posY] !== undefined && (PixelCanvas[Pixeldata.posX][Pixeldata.posY] === 1));

	for (var i = 0; i < Pixeldata.pixelSize; i++)
	{
		PixelCanvas[Pixeldata.posX + i] = [];
		for (var j= 0; j < Pixeldata.pixelSize; j++ ) {
			PixelCanvas[Pixeldata.posX + i][Pixeldata.posY + j] = 1;
		}
	}

	drawPixel(canvasId, Pixeldata);
}


function drawPixelColor(canvasName, x, y, red, green, blue) {
	Pixeldata.red = red;
	Pixeldata.green = green;
	Pixeldata.blue = blue;
	var canvasId = canvasName.substring(1);
	drawPixel(canvasId, Pixeldata);
}

function drawPixelToCanvasRdmColor(canvasName, x, y, transp)
{
	Pixeldata.red = parseInt(Math.random()*255);
	Pixeldata.green = parseInt(Math.random()*255);
	Pixeldata.blue = parseInt(Math.random()*255);
	Pixeldata.transp = transp;
	Pixeldata.posX = x;
	Pixeldata.posY = y;
	var canvasId = canvasName.substring(1);
	drawPixelT(canvasId, Pixeldata);
}

function drawPixelToCanvas(canvasName, x, y, red, green, blue, transp)
{
	Pixeldata.red = red;
	Pixeldata.green = green;
	Pixeldata.blue = blue;
	Pixeldata.transp = transp;
	Pixeldata.posX = x;
	Pixeldata.posY = y;
	var canvasId = canvasName.substring(1);
	drawPixelT(canvasId, Pixeldata);
}

function drawCanvasColorT(canvasName, x, y, red, green, blue, transp)
{
	Pixeldata.red = red;
	Pixeldata.green = green;
	Pixeldata.blue = blue;
	Pixeldata.transp = transp;
	Pixeldata.posX = x;
	Pixeldata.posY = y;
	var canvasId = canvasName.substring(1);
	drawPixelT(canvasId, Pixeldata);
}

function drawRandomT(canvasName, transp)
{
	Pixeldata.red = parseInt(Math.random()*255);
	Pixeldata.green = parseInt(Math.random()*255);
	Pixeldata.blue = parseInt(Math.random()*255);
	Pixeldata.transp = transp;
	var canvasId = canvasName.substring(1);
	var canvasEl = document.getElementById(canvasId);
	var divWidth = canvasEl.width;
	var divLength = canvasEl.height;

	do {
		do {
			Pixeldata.posX = parseInt(Math.random() * divWidth);
		}
		while ((Pixeldata.posX % Pixeldata.pixelSize) !== 0);

		do {
			Pixeldata.posY = parseInt(Math.random() * divLength);
		}
		while ((Pixeldata.posY % Pixeldata.pixelSize) !== 0);
	}
	while (PixelCanvas[Pixeldata.posX] !== undefined && PixelCanvas[Pixeldata.posX][Pixeldata.posY] !== undefined && (PixelCanvas[Pixeldata.posX][Pixeldata.posY] === 1));

	for (var i = 0; i < Pixeldata.pixelSize; i += Pixeldata.pixelSize)
	{
		if (PixelCanvas[i] === undefined)
		{
			PixelCanvas[i] = [];
		}
		for (var j= 0; j < Pixeldata.pixelSize; j += Pixeldata.pixelSize ) {
			PixelCanvas[(Pixeldata.posX + i)][(Pixeldata.posY + j)] = 1;
		}
	}

	drawPixelT(canvasId, Pixeldata);
}

// FIX: color.red/green/blue au lieu de color[red], canvasName -> canvas
function drawRandom2(canvasName, color)
{
	Pixeldata.red = color.red;
	Pixeldata.green = color.green;
	Pixeldata.blue = color.blue;
	var canvasId = canvasName.substring(1);
	var canvasEl = document.getElementById(canvasId);
	var divWidth = canvasEl.width;
	var divLength = canvasEl.height;

	do {
		do {
			Pixeldata.posX = parseInt(Math.random() * divWidth);
		}
		while ((Pixeldata.posX % Pixeldata.pixelSize) !== 0);

		do {
			Pixeldata.posY = parseInt(Math.random() * divLength);
		}
		while ((Pixeldata.posY % Pixeldata.pixelSize) !== 0);
	}
	while (PixelCanvas[Pixeldata.posX] !== undefined && PixelCanvas[Pixeldata.posX][Pixeldata.posY] !== undefined && (PixelCanvas[Pixeldata.posX][Pixeldata.posY] === 1));

	for (var i = 0; i < Pixeldata.pixelSize; i++)
	{
		PixelCanvas[Pixeldata.posX + i] = [];
		for (var j= 0; j < Pixeldata.pixelSize; j++ ) {
			PixelCanvas[Pixeldata.posX + i][Pixeldata.posY + j] = 1;
		}
	}

	drawPixel(canvasId, Pixeldata);
}

// FIX: parametre transp corrige (etait tranp)
function drawRandom2T(canvasName, red, green, blue, transp)
{
	Pixeldata.red = red;
	Pixeldata.green = green;
	Pixeldata.blue = blue;
	Pixeldata.transp = transp;

	var canvasId = canvasName.substring(1);
	var canvasEl = document.getElementById(canvasId);
	var divWidth = canvasEl.width;
	var divLength = canvasEl.height;

	do {
		do {
			Pixeldata.posX = parseInt(Math.random() * divWidth);
		}
		while ((Pixeldata.posX % Pixeldata.pixelSize) !== 0);

		do {
			Pixeldata.posY = parseInt(Math.random() * divLength);
		}
		while ((Pixeldata.posY % Pixeldata.pixelSize) !== 0);
	}
	while (PixelCanvas[Pixeldata.posX] !== undefined && PixelCanvas[Pixeldata.posX][Pixeldata.posY] !== undefined && (PixelCanvas[Pixeldata.posX][Pixeldata.posY] === 1));

	for (var i = 0; i < Pixeldata.pixelSize; i += Pixeldata.pixelSize)
	{
		if (PixelCanvas[i] === undefined)
		{
			PixelCanvas[i] = [];
		}
		for (var j= 0; j < Pixeldata.pixelSize; j += Pixeldata.pixelSize ) {
			PixelCanvas[(Pixeldata.posX + i)][(Pixeldata.posY + j)] = 1;
		}
	}

	drawPixelT(canvasId, Pixeldata);
}


// FIX: passe canvasId a drawPixel, utilise canvas au lieu de canvasName
function drawPixelLine(canvasName, Pixeldata, y)
{
	var canvasId = canvasName.substring(1);
	var canvasEl = document.getElementById(canvasId);
	var divWidth = parseInt(canvasEl.width);
	Pixeldata.posY = y;

	for (var i = 0; i < divWidth; i+= Pixeldata.pixelSize)
	{
		Pixeldata.posX = i;
		drawPixel(canvasId, Pixeldata);
	}
}


// FIX: utilise canvas au lieu de canvasName, passe canvasId a drawPixel
function drawPixelColumn(canvasName, Pixeldata, x)
{
	var canvasId = canvasName.substring(1);
	var canvasEl = document.getElementById(canvasId);
	var divLength = parseInt(canvasEl.height);
	Pixeldata.posX = x;
	for (var i = 0; i < divLength; i += Pixeldata.pixelSize)
	{
		Pixeldata.posY = i;
		drawPixel(canvasId, Pixeldata);
	}
}


function draw(canvasName)
{
	var Pixeldata = pixelDataCreate(4, 0, 0, 0, 0, 0);
	var j = 0;
	var canvasId = canvasName.substring(1);
	var canvasEl = document.getElementById(canvasId);
	var divWidth = parseInt(canvasEl.width);
	function drawColumns()
	{
		drawPixelColumn(canvasName, Pixeldata, j);
		j += Pixeldata.pixelSize;
		if (j > divWidth)
			j = 0;
	}

	setInterval(drawColumns, 1000);
}
