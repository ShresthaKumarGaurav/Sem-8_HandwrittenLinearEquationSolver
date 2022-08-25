const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");

const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

const clear1 = document.getElementById("clear1");
const clear2 = document.getElementById("clear2");

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
	choice = document.getElementById("selectedmethod").value;

	img1.src = canvas1.toDataURL();
	img2.src = canvas2.toDataURL();
	// img3.src = canvas3.toDataURL();

	imgData1 = img1.src.split(",")[1];
	imgData2 = img2.src.split(",")[1];

	let data = {
		Image1: imgData1,
		Image2: imgData2,
	};

	clearAnswer();

	fetch("/upload2", {
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
				if (res.Eqn_3 !== undefined) {
					Eqn_3.innerText = res.Eqn_3;
				}
				javascript_solver.apply(null, res.Ans);
				if (res.Soln_Z !== undefined) {
					Z.innerText = res.Soln_Z;
				}
			} else {
				error.innerText = "Error";
			}
		});
});

function resize() {
	prepareCanvas(canvas1, ctx1, clear1);
	prepareCanvas(canvas2, ctx2, clear2);
}

function clearAnswer() {
	eq1.innerText = "";
	eq2.innerText = "";
	X.innerText = "";
	Y.innerText = "";
	error.innerText = "";
}

function javascript_solver(eq1,eq2)
{
	if(choice == "0")
	{
		var det_xyz = (eq1[0]*eq2[1]) -  (eq1[1]*eq2[0]) ;
		steps.innerHTML = "<br>The determinant is &nbsp;| " + eq1[0] + " " + eq1[1] + " | <br>" + " <span style='margin-left:27.5%;'>| " + eq2[0] + " </span> " + eq2[1] + " |" + " = " + det_xyz;
		if (det_xyz == 0)
		{
			steps.innerText = "Determinant is zero"
		}
		else
		{
			var temp = eq1[0];
			eq1[0] = eq2[1];
			eq2[1] = temp;
			eq1[1] *= (-1); eq2[0] *= (-1);
			eq1[2] *= (-1); eq2[2] *= (-1);
			steps.innerHTML += "<br> Then, <br> A<sup>-1</sup> = (1/|A|) <sup>┌</sup> d -b <sup>┐</sup><br> <span style='margin-left:18%'>" + "<sub>└</sub>-c a <sub>┘</sub></span>";
			steps.innerHTML += "<br> <span style='margin-left:6%'></span> = (1/|" + det_xyz + "|) <sup>┌</sup>" +eq1[0]+" "+eq1[1]+"<sup>┐</sup><br> <span style='margin-left:17.5%'></span><sub>└</sub>" +eq2[0]+" "+eq2[1]+"<sub>┘</sub>";
			steps.innerHTML += "<br> Now, X = A<sup>-1</sup>B";
			steps.innerHTML += "<br><br> <sup>┌</sup> x <sup>┐</sup> = (1/|" + det_xyz + "|) <sup>┌</sup>" +eq1[0]+" "+eq1[1]+"<sup>┐</sup> <sup>┌</sup>"+eq1[2]+"<sup>┐</sup> <br><sub>└</sub> y <sub>┘</sub><sub style='margin-left:12.5%;'>└</sub>" +eq2[0]+" "+eq2[1]+"<sub>┘</sub> <sub>└</sub>"+eq2[2]+" <sub>┘</sub>";
			steps.innerHTML += "<br><br> <sup>┌</sup> x <sup>┐</sup> = (1/|" + det_xyz + "|) <sup>┌</sup>(" +eq1[0]+"x"+eq1[2]+")("+eq1[1]+"x"+eq2[2]+")<sup>┐</sup> <br><sub>└</sub> y <sub>┘</sub><sub style='margin-left:12.5%;'>└</sub>(" +eq2[0]+"x"+eq1[2]+")("+eq2[1]+"x"+eq2[2]+")<sub>┘</sub>";
			eq1[0] = (eq1[0]*eq1[2])+(eq1[1]*eq2[2]);
			eq2[0] = (eq2[0]*eq1[2])+(eq2[1]*eq2[2]);
			steps.innerHTML += "<br><br> <sup>┌</sup> x <sup>┐</sup> = (1/|" + det_xyz + "|) <sup>┌</sup>"+eq1[0]+"<sup>┐</sup> <br><sub>└</sub> y <sub>┘</sub><sub style='margin-left:12.5%;'>└</sub>"+eq2[0]+"<sub>┘</sub>";
			eq1[0] = eq1[0] / det_xyz;
			eq2[0] = eq2[0] / det_xyz;
			steps.innerHTML += "<br><br> <sup>┌</sup> x <sup>┐</sup> = <sup>┌</sup>"+eq1[0]+"<sup>┐</sup> <br><sub>└</sub> y <sub>┘</sub><sub style='margin-left:4%;'>└</sub>"+eq2[0]+"<sub>┘</sub>";

			X.innerText = eq1[0].toFixed(3);
			Y.innerText = eq2[0].toFixed(3);
		}
	}
	else if(choice == "1")
	{	
		var a=eq1[0];var b=eq1[1];var c=eq1[2]*(-1);
		var d=eq2[0];var e=eq2[1];var f=eq2[2]*(-1);
		steps.innerHTML = "<br> Given, <br> "+a+"x + "+b+"y = "+c+" .......eqn1<br>"+d+"x + "+e+"y = "+f+" .......eqn2" ;
		steps.innerHTML += "<br><br>From eqn1, we get <br>y = ("+c+"-"+a+"x) / "+b; 
		steps.innerHTML += "<br>From eqn2, we get <br>y = ("+f+"-"+d+"x) / "+e; 
		steps.innerHTML += "<br><br>Thus, we have <br>("+c+"-"+a+"x) / "+b+" = ("+f+"-"+d+"x) / "+e;
		var ansX = (((f*b)-(c*e))/((b*d)-(a*e)));
		var ansY = (c-(a*ansX))/b;
		steps.innerHTML += "<br><br>Solving this, we get <br>x = "+ansX;
		steps.innerHTML += "<br><br>Using this value of x in eqn1 we get,<br>y = ("+c+" - "+a+"("+ansX+")"+") / "+b;
		steps.innerHTML += "<br>y = "+ansY;

		X.innerText = ansX.toFixed(3);
		Y.innerText = ansY.toFixed(3);
	}
	else if(choice == "2")
	{
		var a1=eq1[0];var b1=eq1[1];var c1=eq1[2];var d2=eq2[3];
		var a2=eq2[0];var b2=eq2[1];var c2=eq2[2];var d2=eq2[3];
		steps.innerHTML = "<br>Given,<br> "+a1+"x + "+b1+"y "+c1+" = 0 => a<sub>1</sub>x + b<sub>1</sub>y + c<sub>1</sub> = 0<br>"+a2+"x + "+b2+"y "+c2+" = 0 => a<sub>2</sub>x + b<sub>2</sub>y + c<sub>2</sub> = 0" ;
		steps.innerHTML += "<br><br>We know,<br><sub style='margin-left:10%;'></sub>x = ∆<sub>1</sub>/∆, y = ∆<sub>2</sub>/∆";
		steps.innerHTML += "<br>where, ∆<sub>1</sub> = | b<sub>1</sub> c<sub>1</sub> |, ∆<sub>2</sub> = | c<sub>1</sub> a<sub>1</sub> |, ∆ = | a<sub>1</sub> b<sub>1</sub> |<br><sub style='margin-left:16.5%;'></sub>| b<sub>2</sub> c<sub>2</sub> |<sub style='margin-left:8%;'></sub>| c<sub>2</sub> a<sub>2</sub> |<sub style='margin-left:7%;'></sub>| a<sub>2</sub> b<sub>2</sub> |";
		steps.innerHTML += "<br><br>Here,<br>∆<sub>1</sub> = | "+b1+" "+c1+" |, ∆<sub>2</sub> = | "+c1+" "+a1+" |, ∆ = | "+a1+" "+b1+" |<br><sub style='margin-left:6.5%;'></sub>| "+b2+" "+c2+" |<sub style='margin-left:8.5%;'></sub>| "+c2+" "+a2+" |<sub style='margin-left:6.5%;'></sub>| "+a2+" "+b2+" |";
		var ansX = ((b1*c2)-(b2*c1))/((a1*b2)-(a2*b1));
		var ansY = ((a2*c1)-(a1*c2))/((a1*b2)-(a2*b1))
		steps.innerHTML += "<br><br>So, X = (("+b1+"*"+c2+")-("+b2+"*"+c1+"))/(("+a1+"*"+b2+")-("+a2+"*"+b1+")) = "+ansX+"<br><sub style='margin-left:5%;'></sub>Y = (("+a2+"*"+c1+")-("+a1+"*"+c2+"))/(("+a1+"*"+b2+")-("+a2+"*"+b1+")) = "+ansY;

		X.innerText = ansX.toFixed(3);
		Y.innerText = ansY.toFixed(3);
	}
}
