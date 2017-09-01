/***** bibliotheque pour recuperer la taille d'une DIV de ID pixelArray *****/
/*****Structure *****/

"use strict";


var Pixeldata = {};
var PixelCanvas = [[]];
var red;
var green;
var blue;
var transp;
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
}}



function drawRect(canvasId, Pixeldata, Xsize, Ysize){
var canvas = document.getElementById(canvasId);
if (canvas.getContext){
	var context = canvas.getContext('2d');
	context.fillStyle = 'rgb('+Pixeldata.red+','+Pixeldata.green+','+Pixeldata.blue+')';
	context.fillRect(Pixeldata.posX, Pixeldata.posY, Xsize, Ysize);
}}

function drawPixelT(canvasId, Pixeldata){
var canvas = document.getElementById(canvasId);
if (canvas.getContext){
	var context = canvas.getContext('2d');
	context.fillStyle= 'rgba('+Pixeldata.red+ ',' +Pixeldata.green+','+Pixeldata.blue+','+Pixeldata.transp+')';
	context.fillRect(Pixeldata.posX, Pixeldata.posY, Pixeldata.pixelSize, Pixeldata.pixelSize);
}}



function drawRectT(canvasId, PixeldataT, Xsize, Ysize){
var canvas = document.getElementById(canvasId);
if (canvas.getContext){
	var context = canvas.getContext('2d');
    context.fillStyle= 'rgba('+Pixeldata.red+ ',' +Pixeldata.green+','+Pixeldata.blue+','+Pixeldata.transp+')';
	context.fillRect(Pixeldata.posX, Pixeldata.posY, Xsize, Ysize);
}}

function drawRandom(canvas)
{

Pixeldata.red = parseInt(Math.random()*255); 
Pixeldata.green = parseInt(Math.random()*255);
Pixeldata.blue = parseInt(Math.random()*255);
Pixeldata.pixelSize = 4;
var divWidth = $(canvas).width();
var divLength =$(canvas).height();

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
	    PixelCanvas[Pixeldata.posX + i][Pixeldata.posY + j] = 1;}
}

    var canvasId = canvas.substring(1);
drawPixel(canvasId, Pixeldata);
}


function drawPixelColor(canvasName, x, y, red, green, blue) {

    Pixeldata.red = red;
    Pixeldata.green = green;
    Pixeldata.blue = blue;

    var canvasId = canvasName.substring(1);
    drawPixel(canvasId, Pixeldata);
}

function drawRdmPixelTToCanvas(canvas, x, y)
{
    Pixeldata.red = parseInt(Math.random()*255);
    Pixeldata.green = parseInt(Math.random()*255);
    Pixeldata.blue = parseInt(Math.random()*255);
    Pixeldata.posX = x;
    Pixeldata.posY = y;
    var canvasId = canvas.substring(1);
    drawPixelT(canvasId, Pixeldata);
}

function drawPixelToCanvas(canvasName, x, y, red, green ,blue)
{
    Pixeldata.red = red;
    Pixeldata.green = green;
    Pixeldata.blue = blue;
    Pixeldata.transp = 1;
    Pixeldata.posX = x;
    Pixeldata.posY = y;
    var canvasId = canvasName.substring(1);
    drawPixelT(canvasId, Pixeldata);

}

function drawCanvasColorT(canvas,x,y, red,green,blue, transp)
{

    Pixeldata.red = red;
    Pixeldata.green = green;
    Pixeldata.blue = blue;
    Pixeldata.transp = transp;
    Pixeldata.posX = x;
    Pixeldata.posY = y;
    var canvasId = canvas.substring(1);
    drawPixel(canvasId, Pixeldata);
}

function drawRandomT(canvas, transp)
{
    Pixeldata.red = parseInt(Math.random()*255);
    Pixeldata.green = parseInt(Math.random()*255);
    Pixeldata.blue = parseInt(Math.random()*255);
    Pixeldata.transp = transp;
    var divWidth = $(canvas).width();
    var divLength =$(canvas).height();

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

    var canvasId = canvas.substring(1);
    drawPixelT(canvasId, Pixeldata);
}

function drawRandom2(canvas, color)
{

    Pixeldata.red = color[red];
    Pixeldata.green = color[green];
    Pixeldata.blue = color[blue];
    var divWidth = $(canvas).width();
    var divLength = $(canvasName).height();

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
            PixelCanvas[Pixeldata.posX + i][Pixeldata.posY + j] = 1;}
    }

    var canvasId = canvas.substring(1);
    drawPixel(canvasId, Pixeldata);
}

function drawRandom2T(canvas, red, green, blue, tranp)
{

    Pixeldata.red = red;
    Pixeldata.green = green;
    Pixeldata.blue = blue;
    Pixeldata.transp = transp;

    var divWidth = $(canvas).width();
    var divLength =$(canvas).height();

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

    var canvasId = canvas.substring(1);
    drawPixelT(canvasId, Pixeldata);
}


function drawCanvasColorT(canvas,x,y, red,green,blue, transp)
{

    Pixeldata.red = red;
    Pixeldata.green = green;
    Pixeldata.blue = blue;
    Pixeldata.transp = transp;

    Pixeldata.posX = x;
    Pixeldata.posY = y;


    var canvasId = canvas.substring(1);
    drawPixel(canvasId, Pixeldata);
}

function drawPixelLine(canvas, Pixeldata, y)
{
var divWidth = parseInt($(canvas).width());
Pixeldata.posY = y;

for (var i = 0; i < divWidth; i+= Pixeldata.pixelSize)
	{

		Pixeldata.posX = i;
		console.log(Pixeldata.posX);
		drawPixel(Pixeldata);
	}
}


function drawPixelColumn(canvas, Pixeldata, x)
{
var divLength = parseInt($(canvasName).height());
Pixeldata.posX = x;
for (var i = 0; i < divLength; i += Pixeldata.pixelSize) 
	{
		Pixeldata.posY = i;
		drawPixel(Pixeldata);
	}
}


function draw (canvas)
{
	var Pixeldata = pixelDataCreate(4, 0 ,0, 0 , 0, 0);
	var j = 0;
	var divWidth = parseInt($(canvas).width());
	function drawColumns()
		{	
			drawPixelColumn("gameOfLife", Pixeldata, j);
			j += Pixeldata.pixelSize;
			if (j > divWidth)
				j = 0;
		}

	setInterval(drawColumns, 1000);
}




