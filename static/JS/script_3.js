const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");

const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");

const clear1 = document.getElementById("clear1");
const clear2 = document.getElementById("clear2");
const clear3 = document.getElementById("clear3");

const eq1 = document.getElementById("eq1");
const eq2 = document.getElementById("eq2");
const eq3 = document.getElementById("eq3");

const X = document.getElementById("solnX");
const Y = document.getElementById("solnY");
const Z = document.getElementById("solnZ");

const steps = document.getElementById("steps");
var choice = document.getElementById("selectedmethod").value;

const error = document.getElementById("error");

const calc = document.getElementById("calc");

const lineWidth = 2;
const lineColor = "#000";

function prepareCanvas(canvas, ctx, clearBtn) {
	const canvasWidth = canvas.clientWidth;
	const canvasHeight = canvas.clientHeight;

	let isDrawing = false;
	let curPos; // current position

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	function getPosition(clientX, clientY) {
		let box = canvas.getBoundingClientRect();
		return { x: clientX - box.x, y: clientY - box.y };
	}

	function draw(e) {
		if (isDrawing) {
			let pos = getPosition(e.clientX, e.clientY);

			ctx.strokeStyle = lineColor;
			ctx.lineWidth = lineWidth;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.beginPath();
			ctx.moveTo(curPos.x, curPos.y);
			ctx.lineTo(pos.x, pos.y);
			ctx.stroke();
			ctx.closePath();
			curPos = pos;
		}
	}

	canvas.onmousedown = function (e) {
		isDrawing = true;
		curPos = getPosition(e.clientX, e.clientY);
		draw(e);
	};

	canvas.onmousemove = function (e) {
		draw(e);
	};

	canvas.onmouseup = function (e) {
		isDrawing = false;
	};

	// Set up touch events for mobile, etc
	canvas.addEventListener(
		"touchstart",
		function (e) {
			mousePos = getTouchPos(canvas, e);
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousedown", {
				clientX: touch.clientX,
				clientY: touch.clientY,
			});
			canvas.dispatchEvent(mouseEvent);
		},
		false
	);
	canvas.addEventListener(
		"touchend",
		function (e) {
			var mouseEvent = new MouseEvent("mouseup", {});
			canvas.dispatchEvent(mouseEvent);
		},
		false
	);
	canvas.addEventListener(
		"touchmove",
		function (e) {
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousemove", {
				clientX: touch.clientX,
				clientY: touch.clientY,
			});
			canvas.dispatchEvent(mouseEvent);
		},
		false
	);

	clearBtn.addEventListener("click", clearCanvas);

	function clearCanvas() {
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	}
	clearCanvas();

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top,
		};
	}
}

window.addEventListener("load", resize);
window.addEventListener("resize", resize);

calc.addEventListener("click", () => {
	const img1 = new Image();
	const img2 = new Image();
	const img3 = new Image();
	choice = document.getElementById("selectedmethod").value;

	img1.src = canvas1.toDataURL();
	img2.src = canvas2.toDataURL();
	img3.src = canvas3.toDataURL();

	imgData1 = img1.src.split(",")[1];
	imgData2 = img2.src.split(",")[1];
	imgData3 = img3.src.split(",")[1];

	let data = {
		Image1: imgData1,
		Image2: imgData2,
		Image3: imgData3,
	};

	clearAnswer();

	fetch("/upload3", {
		method: "POST",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.then((res) => {
			if (res.Success) {
				eq1.innerText = res.Eqn_1;
				eq2.innerText = res.Eqn_2;
				eq3.innerText = res.Eqn_3;
				javascript_solver.apply(null, res.Ans);
			} else {
				error.innerText = "Error";
			}
		});
});

function resize() {
	prepareCanvas(canvas1, ctx1, clear1);
	prepareCanvas(canvas2, ctx2, clear2);
	prepareCanvas(canvas3, ctx3, clear3);
}

function clearAnswer() {
	eq1.innerText = "";
	eq2.innerText = "";
	eq3.innerText = "";
	X.innerText = "";
	Y.innerText = "";
	Z.innerText = "";
	error.innerText = "";
}

function javascript_solver(eq1,eq2,eq3)
{
	if(choice == "0")
	{   
		var a1=eq1[0];var b1=eq1[1];var c1=eq1[2];
		var a2=eq2[0];var b2=eq2[1];var c2=eq2[2];
		var a3=eq3[0];var b3=eq3[1];var c3=eq3[2];
		var det_xyz = (a1*((b2*c3)-(b3*c2)))-(b1*((a2*c3)-(a3*c2)))+(c1*((a2*b3)-(a3*b2)));

		steps.innerHTML = "<br>The determinant is &nbsp;| " + a1 + " " + b1 + " " + c1 +" | <br><span style='margin-left:27.5%;'>| " + a2 + " </span> " + b2 + " " + c2 + " | <br><span style='margin-left:27.5%;'>| " + a3 +" </span>"+b3+" "+c3+"| = " + det_xyz;
		if (det_xyz == 0)
		{
			steps.innerText = "Determinant is zero"
		}
		else
		{
			var A11 = ((b2*c3)-(b3*c2));var A12 = ((a3*c2)-(a2*c3));var A13 = ((a2*b3)-(a3*b2));var B1 = eq1[3]*(-1);
			var A21 = ((b3*c1)-(b1*c3));var A22 = ((a1*c3)-(a3*c1));var A23 = ((a3*b1)-(a1*b3));var B2 = eq2[3]*(-1);
			var A31 = ((b1*c2)-(b2*c1));var A32 = ((a2*c1)-(a1*c2));var A33 = ((a1*b2)-(a2*b1));var B3 = eq3[3]*(-1);
			steps.innerHTML += "<br><br>Cofactor of A11 = | b<sub>2</sub> c<sub>2</sub> |<br><sub style='margin-left:24.5%;'></sub>| b<sub>3</sub> c<sub>3</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = | "+b2+" "+c2+" |<br><sub style='margin-left:22.5%;'></sub>| "+b3+" "+c3+" | = "+A11;
            steps.innerHTML += "<br><br>Cofactor of A12 = - | a<sub>2</sub> c<sub>2</sub> |<br><sub style='margin-left:26.5%;'></sub>| a<sub>3</sub> c<sub>3</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = - | "+a2+" "+c2+" |<br><sub style='margin-left:24.5%;'></sub>| "+a3+" "+c3+" | = "+A12;
			steps.innerHTML += "<br><br>Cofactor of A13 = | a<sub>2</sub> b<sub>2</sub> |<br><sub style='margin-left:24.5%;'></sub>| a<sub>3</sub> b<sub>3</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = | "+a2+" "+b2+" |<br><sub style='margin-left:22.5%;'></sub>| "+a3+" "+b3+" | = "+A13;
			steps.innerHTML += "<br><br>Cofactor of A21 = - | b<sub>1</sub> c<sub>1</sub> |<br><sub style='margin-left:26.5%;'></sub>| b<sub>3</sub> c<sub>3</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = - | "+b1+" "+c1+" |<br><sub style='margin-left:24.5%;'></sub>| "+b3+" "+c3+" | = "+A21;
            steps.innerHTML += "<br><br>Cofactor of A22 = | a<sub>1</sub> c<sub>1</sub> |<br><sub style='margin-left:24.5%;'></sub>| a<sub>3</sub> c<sub>3</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = | "+a1+" "+c1+" |<br><sub style='margin-left:22.5%;'></sub>| "+a3+" "+c3+" | = "+A22;
			steps.innerHTML += "<br><br>Cofactor of A23 = - | a<sub>1</sub> b<sub>1</sub> |<br><sub style='margin-left:26.5%;'></sub>| a<sub>3</sub> b<sub>3</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = - | "+a1+" "+b1+" |<br><sub style='margin-left:24.5%;'></sub>| "+a3+" "+b3+" | = "+A23;
			steps.innerHTML += "<br><br>Cofactor of A31 = | b<sub>1</sub> c<sub>1</sub> |<br><sub style='margin-left:24.5%;'></sub>| b<sub>2</sub> c<sub>2</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = | "+b1+" "+c1+" |<br><sub style='margin-left:22.5%;'></sub>| "+b2+" "+c2+" | = "+A31;
			steps.innerHTML += "<br><br>Cofactor of A32 = - | a<sub>1</sub> c<sub>1</sub> |<br><sub style='margin-left:26.5%;'></sub>| a<sub>2</sub> c<sub>2</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = - | "+a1+" "+c1+" |<br><sub style='margin-left:24.5%;'></sub>| "+a2+" "+c2+" | = "+A32;
			steps.innerHTML += "<br><br>Cofactor of A33 = | a<sub>1</sub> b<sub>1</sub> |<br><sub style='margin-left:24.5%;'></sub>| a<sub>2</sub> b<sub>2</sub> |"; 
			steps.innerHTML += "<br><sub style='margin-left:20%;'></sub> = | "+a1+" "+b1+" |<br><sub style='margin-left:22.5%;'></sub>| "+a2+" "+b2+" | = "+A33;
			steps.innerHTML += "<br><br>Then,<br>co-factor matrix = <sup>┌</sup> A11 A12 A13 <sup>┐</sup><br><span style='margin-left:24%;'></span>| A21 A22 A23 | <br><sub style='margin-left:24%;'></sub><sub>└</sub> A31 A32 A33 <sub>┘</sub>";
			steps.innerHTML += "<br> <sub style='margin-left:24%;'></sub>= <sup>┌</sup> "+A11+" "+A12+" "+A13+" <sup>┐</sup><br><sub style='margin-left:24%;'></sub>| "+A21+" "+A22+" "+A23+" |<br><sub style='margin-left:24%;'></sub><sub>└</sub> "+A31+" "+A32+" "+A33+" <sub>┘</sub>";
			steps.innerHTML += "<br><br>Then,<br>adjoint matrix = <sup>┌</sup> A11 A21 A31 <sup>┐</sup><br><span style='margin-left:24%;'></span>| A12 A22 A32 | <br><sub style='margin-left:24%;'></sub><sub>└</sub> A13 A23 A33 <sub>┘</sub>";
			steps.innerHTML += "<br> <sub style='margin-left:24%;'></sub>= <sup>┌</sup> "+A11+" "+A21+" "+A31+" <sup>┐</sup><br><sub style='margin-left:24%;'></sub>| "+A12+" "+A22+" "+A32+" |<br><sub style='margin-left:24%;'></sub><sub>└</sub> "+A13+" "+A23+" "+A33+" <sub>┘</sub>";	
			steps.innerHTML += "<br><br>Then,<br><sub style='margin-left:10%;'></sub>X = A<sup>-1</sup>B<br><sub style='margin-left:15%;'></sub>= (1/|A|) * adjoint A * B";
			steps.innerHTML += "<br><sub style='margin-left:15%;'></sub>= (1/|"+det_xyz+"|) <sup>┌</sup> "+A11+" "+A21+" "+A31+" <sup>┐</sup> <sup>┌</sup> "+eq1[3]+" <sup>┐</sup><br><sub style='margin-left:24%;'></sub>| "+A12+" "+A22+" "+A32+" | | "+eq2[3]+" |<br><sub style='margin-left:24%;'></sub><sub>└</sub> "+A13+" "+A23+" "+A33+" <sub>┘</sub> <sub>└</sub> "+eq3[3]+" <sub>┘</sub>";
			
			var ansX = ((A11*B1)+(A21*B2)+(A31*B3));
			var ansY = ((A12*B1)+(A22*B2)+(A32*B3));
			var ansZ = ((A13*B1)+(A23*B2)+(A33*B3));
			steps.innerHTML += "<br><br><sub style='margin-left:15%;'></sub>= <sup>┌</sup> "+ansX+" <sup>┐</sup><br><sub style='margin-left:15%;'></sub>| "+ansY+" |<br><sub style='margin-left:15%;'></sub><sub>└</sub> "+ansZ+" <sub>┘</sub>";
			X.innerText = ansX.toFixed(3);
			Y.innerText = ansY.toFixed(3);
			Z.innerText = ansZ.toFixed(3);
		}
	}
	else if(choice == "1")
	{	
		var x1 = eq1[0];var y1 = eq1[1];var z1 = eq1[2]; var c1 = eq1[3]*(-1);
		var x2 = eq2[0];var y2 = eq2[1];var z2 = eq2[2];var c2 = eq2[3]*(-1);
		var x3 = eq3[0];var y3 = eq3[1];var z3 = eq3[2];var c3 = eq3[3]*(-1);
		steps.innerHTML = "<br> Given, <br> "+x1+"x + "+y1+"y + "+z1+"z = "+c1+" .......eqn1<br>"+x2+"x + "+y2+"y + "+z2+"z = "+c2+" .......eqn2<br>"+x3+"x + "+y3+"y + "+z3+"z = "+c3+" .......eqn3" ;
		steps.innerHTML += "<br><br>From eqn1, we get <br>x = ("+c1+"-"+y1+"y"+"-"+z1+"z"+") / "+x1+".......eqn4"; 
		var z11 = z2 + (x2*z1);
		steps.innerHTML += "<br><br>From eqn1 and eqn2, we get <br>z = -( ("+c1+"-"+y1+"y"+") * "+x2+" + "+y2+"y"+" - "+c2+") / "+z11+".......eqn5";
		steps.innerHTML += "<br><br>From eqn3,eqn4 and eqn5, we get <br>  ("+c1+"-"+y1+"y"+"-"+z1+"z"+")"+x3+"+"+y3+"y"+"-( ("+c1+"-"+y1+"y"+") * "+x2+" + "+y2+"y"+" - "+c2+")"+z3+"="+c3;
		steps.innerHTML += "<br>("+c1+"-"+y1+"y"+"-"+"(-( ("+c1+"-"+y1+"y"+") * "+x2+" + "+y2+"y"+" - "+c2+") / "+z11+")"+")"+z3+x3+"+"+y3+"y"+"-( ("+c1+"-"+y1+"y"+") * "+x2+" + "+y2+"y"+" - "+c2+")"+z3+"="+c3;
		var a1=eq1[0];var b1=eq1[1];var c1=eq1[2];var d1=eq1[3]*(-1);
		var a2=eq2[0];var b2=eq2[1];var c2=eq2[2];var d2=eq2[3]*(-1);
		var a3=eq3[0];var b3=eq3[1];var c3=eq3[2];var d3=eq3[3]*(-1);

		var D1 = (d1*((b2*c3)-(b3*c2)))+(d2*((b3*c1)-(b1*c3)))+(d3*((b1*c2)-(b2*c1)));
		var D2 = (a1*((d2*c3)-(d3*c2)))+(a2*((d3*c1)-(d1*c3)))+(a3*((d1*c2)-(d2*c1)));
		var D3 = (a1*((b2*d3)-(b3*d2)))+(a2*((b3*d1)-(b1*d3)))+(a3*((b1*d2)-(b2*d1)));
		var D = (a1*((b2*c3)-(b3*c2)))+(a2*((b3*c1)-(b1*c3)))+(a3*((b1*c2)-(b2*c1)));  

		var ansX=(D1/D);var ansY=(D2/D);var ansZ=(D3/D);
		steps.innerHTML += "<br> y ="+ansY;
		steps.innerHTML += "<br><br>Replacing the value of y in eqn5, we get <br> z ="+ansZ;
		steps.innerHTML += "<br><br>Replacing the value of y and z in eqn4, we get <br> x ="+ansX;
		
		X.innerText = ansX.toFixed(3);
		Y.innerText = ansY.toFixed(3);
		Z.innerText = ansZ.toFixed(3);
	}
	else if(choice == "2")
	{
		var a1=eq1[0];var b1=eq1[1];var c1=eq1[2];var d1=eq1[3]*(-1);
		var a2=eq2[0];var b2=eq2[1];var c2=eq2[2];var d2=eq2[3]*(-1);
		var a3=eq3[0];var b3=eq3[1];var c3=eq3[2];var d3=eq3[3]*(-1);
		steps.innerHTML = "<br>Given,<br> "+a1+"x + "+b1+"y + "+c1+"z +"+d1+"= 0 => a<sub>1</sub>x + b<sub>1</sub>y + c<sub>1</sub>z +d1 = 0<br>"+a2+"x + "+b2+"y +"+c2+"z "+d2+" = 0 => a<sub>2</sub>x + b<sub>2</sub>y + c<sub>2</sub>z +d2 = 0<br>"+a3+"x + "+b3+"y "+c3+"z "+d3+" = 0 => a<sub>3</sub>x + b<sub>3</sub>y + c<sub>3</sub>z + d3 = 0" ;
		steps.innerHTML += "<br><br>We know,<br><sub style='margin-left:10%;'></sub>x = ∆<sub>1</sub>/∆, y = ∆<sub>2</sub>/∆, z = ∆<sub>3</sub>/∆";
		steps.innerHTML += "<br>where, ∆<sub>1</sub> = | d<sub>1</sub> b<sub>1</sub> c<sub>1</sub> |, ∆<sub>2</sub> = | a<sub>1</sub> d<sub>1</sub> c<sub>1</sub> |, ∆<sub>3</sub> = | a<sub>1</sub> b1<sub>1</sub> d<sub>1</sub> |, ∆ = | a<sub>1</sub> b<sub>1</sub> c<sub>1</sub> |<br><sub style='margin-left:16.5%;'></sub>| d<sub>2</sub> b<sub>2</sub> c<sub>2</sub> |<sub style='margin-left:8%;'></sub>| a<sub>2</sub> d<sub>2</sub> c<sub>2</sub> |<sub style='margin-left:8%;'></sub>| a<sub>2</sub> b<sub>2</sub> d<sub>2</sub>|<sub style='margin-left:10%;'></sub>| a<sub>2</sub> b<sub>2</sub> c<sub>2</sub>|<br><sub style='margin-left:16.5%;'></sub>| d<sub>3</sub> b<sub>3</sub> c<sub>3</sub> |<sub style='margin-left:8%;'></sub>| a<sub>3</sub> d<sub>3</sub> c<sub>3</sub> |<sub style='margin-left:8%;'></sub>| a<sub>3</sub> b<sub>3</sub> d<sub>3</sub>| <sub style='margin-left:9%;'></sub>| a<sub>3</sub> b<sub>3</sub> c<sub>3</sub>|";
		steps.innerHTML += "<br><span style='color:white;'>where,</span>∆<sub>1</sub> = | "+d1+" "+b1+" "+c1+" |, ∆<sub>2</sub> = | "+a1+" "+d1+" "+c1+" |, ∆<sub>3</sub> = | "+a1+" "+b1+" "+d1+" |, ∆ = | "+a1+" "+b1+" "+c1+" |<br><sub style='margin-left:16.5%;'></sub>| "+d2+" "+b2+" "+c2+" |<sub style='margin-left:8%;'></sub>| "+a2+" "+d2+" "+c2+" |<sub style='margin-left:8%;'></sub>| "+a2+" "+b2+" "+d2+" |<sub style='margin-left:8%;'></sub>| "+a2+" "+b2+" "+c2+" |<br><sub style='margin-left:16.5%;'></sub>| "+d3+" "+b3+" "+c3+" |<sub style='margin-left:8%;'></sub>| "+a3+" "+d3+" "+c3+" |<sub style='margin-left:8%;'></sub>| "+a3+" "+b3+" "+d3+" | <sub style='margin-left:8%;'></sub>| "+a3+" "+b3+" "+c3+" |";
		
		var D1 = (d1*((b2*c3)-(b3*c2)))+(d2*((b3*c1)-(b1*c3)))+(d3*((b1*c2)-(b2*c1)));
		var D2 = (a1*((d2*c3)-(d3*c2)))+(a2*((d3*c1)-(d1*c3)))+(a3*((d1*c2)-(d2*c1)));
		var D3 = (a1*((b2*d3)-(b3*d2)))+(a2*((b3*d1)-(b1*d3)))+(a3*((b1*d2)-(b2*d1)));
		var D = (a1*((b2*c3)-(b3*c2)))+(a2*((b3*c1)-(b1*c3)))+(a3*((b1*c2)-(b2*c1)));
		steps.innerHTML += "<br><br><span style='color:white;'>where,</span>∆<sub>1</sub> = d<sub>1</sub>(b<sub>2</sub>c<sub>3</sub>-b<sub>3</sub>c<sub>2</sub>) + d<sub>2</sub>(b<sub>3</sub>c<sub>1</sub>-b<sub>1</sub>c<sub>3</sub>) + d<sub>3</sub>(b<sub>1</sub>c<sub>2</sub>-b<sub>2</sub>c<sub>1</sub>) = "+D1;
		steps.innerHTML += "<br><span style='color:white;'>where,</span>∆<sub>2</sub> = a<sub>1</sub>(d<sub>2</sub>c<sub>3</sub>-d<sub>3</sub>c<sub>2</sub>) + a<sub>2</sub>(d<sub>3</sub>c<sub>1</sub>-d<sub>1</sub>c<sub>3</sub>) + a<sub>3</sub>(d<sub>1</sub>c<sub>2</sub>-d<sub>2</sub>c<sub>1</sub>) = "+D2;
		steps.innerHTML += "<br><span style='color:white;'>where,</span>∆<sub>3</sub> = a<sub>1</sub>(b<sub>2</sub>d<sub>3</sub>-b<sub>3</sub>d<sub>2</sub>) + a<sub>2</sub>(b<sub>3</sub>d<sub>1</sub>-b<sub>1</sub>d<sub>3</sub>) + a<sub>3</sub>(b<sub>1</sub>d<sub>2</sub>-b<sub>2</sub>d<sub>1</sub>) = "+D3;
		steps.innerHTML += "<br><span style='color:white;'>where,</span>∆<sub>3</sub> = a<sub>1</sub>(b<sub>2</sub>c<sub>3</sub>-b<sub>3</sub>c<sub>2</sub>) + a<sub>2</sub>(b<sub>3</sub>c<sub>1</sub>-b<sub>1</sub>c<sub>3</sub>) + a<sub>3</sub>(b<sub>1</sub>c<sub>2</sub>-b<sub>2</sub>c<sub>1</sub>) = "+D;
		
		var ansX=(D1/D);var ansY=(D2/D);var ansZ=(D3/D);
		steps.innerHTML += "<br><br>So, X = ∆<sub>1</sub>/∆ = "+D1+"/"+D+" = "+ansX+"<br><sub style='margin-left:5%;'></sub>Y = ∆<sub>2</sub>/∆ = "+D2+"/"+D+" = "+ansY+"<br><sub style='margin-left:5%;'></sub>Z = ∆<sub>3</sub>/∆ = "+D3+"/"+D+" = "+ansZ;

		X.innerText = ansX.toFixed(3);
		Y.innerText = ansY.toFixed(3);
		Z.innerText = ansZ.toFixed(3);
	}
}
