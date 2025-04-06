const canvas = document.getElementById("viewport") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let side_length = 0;

document.body.oninput = (ev) => {
	side_length = (document.getElementById("side_length_input") as HTMLInputElement).valueAsNumber;
};

window.onload = main;

function main(): void
{
	document.body.dispatchEvent(new InputEvent("input"));
	draw();
}

function draw(): void
{
	ctx.fillStyle = "rgb(224, 224, 224)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	requestAnimationFrame(draw);
}