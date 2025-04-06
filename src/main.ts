const canvas = document.getElementById("viewport") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let side_length = 0;
let height = 0;

document.body.oninput = (ev) => {
	side_length = (document.getElementById("side_length_input") as HTMLInputElement).valueAsNumber;
	height = side_length * Math.sqrt(3) / 2;
};

window.onload = main;

function main(): void
{
	document.body.dispatchEvent(new InputEvent("input"));
	draw();
}

function draw(): void
{
	ctx.fillStyle = "rgb(192, 192, 192)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "rgb(128, 128, 128)";
	draw_cartesian_grid();

	ctx.fillStyle = "black";
	draw_point(side_length, height);
	ctx.strokeStyle = "green";
	draw_hexagon(side_length, height, Math.tan(Math.PI / 6) * side_length);

	requestAnimationFrame(draw);
}

function draw_cartesian_grid()
{
	for (let i = 0; i < canvas.width; i += side_length) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
		ctx.stroke();
	}

	for (let i = 0; i < canvas.height; i += height) {
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);
		ctx.stroke();
	}
}

function draw_hexagon(x: number, y: number, side_length: number)
{
	const height = side_length * Math.sqrt(3) / 2;
	ctx.beginPath();
	ctx.moveTo(x, y - side_length);
	ctx.lineTo(x + height, y - side_length / 2);
	ctx.lineTo(x + height, y + side_length / 2);
	ctx.lineTo(x, y + side_length);
	ctx.lineTo(x - height, y + side_length / 2);
	ctx.lineTo(x - height, y - side_length / 2);
	ctx.closePath();
	ctx.stroke();
}

function draw_point(x: number, y: number)
{
	const size = 4;
	ctx.fillRect(x - size / 2, y - size / 2, size, size);
}