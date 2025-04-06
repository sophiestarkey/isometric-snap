interface Point {
	x: number;
	y: number;
}

const canvas = document.getElementById("viewport") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let side_length = 0;
let height = 0;
let cursor: Point = { x: 0, y: 0};

document.body.oninput = (ev) => {
	side_length = (document.getElementById("side_length_input") as HTMLInputElement).valueAsNumber;
	height = side_length * Math.sqrt(3) / 2;
};

window.onmousemove = (ev) => {
	cursor.x = Math.round(ev.clientX - canvas.getBoundingClientRect().left);
	cursor.y = Math.round(ev.clientY - canvas.getBoundingClientRect().top);
};

window.onload = main;

function main(): void
{
	document.body.dispatchEvent(new InputEvent("input"));
	requestAnimationFrame(draw);
}

// returns the squared distance between two points
function sqr_dst(a: Point, b: Point): number
{
	return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
}

// snaps a point to the nearest isometric grid point (rounding down)
function isometry_snap(x: number, y: number): Point
{
	let result_y = Math.floor(y / height);
	let x_offset = Math.abs(result_y % 2) * 0.5;
	let result_x = Math.floor(x / side_length - x_offset) + x_offset;
	return { x: result_x * side_length, y: result_y * height};
}

function draw(): void
{
	// generate points
	let points = [
		isometry_snap(cursor.x, cursor.y),
		isometry_snap(cursor.x + side_length, cursor.y),
		isometry_snap(cursor.x, cursor.y + height),
		isometry_snap(cursor.x + side_length, cursor.y + height)
	];

	let closest = points[0];

	// find closest point to mouse position
	for (let i = 1; i < 4; i++) {
		if (sqr_dst(points[i], cursor) < sqr_dst(closest, cursor)) {
			closest = points[i];
		}
	}

	// background
	ctx.fillStyle = "rgb(192, 192, 192)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// grid
	ctx.strokeStyle = "rgb(128, 128, 128)";
	draw_cartesian_grid();

	// points
	ctx.fillStyle = "black";

	for (let point of points) {
		if (point == closest) {
			ctx.fillStyle = "red";
		} else {
			ctx.fillStyle = "black";
		}

		draw_point(point.x, point.y);
	}
	
	// hexagon
	ctx.strokeStyle = "green";
	draw_hexagon(closest.x, closest.y, Math.tan(Math.PI / 6) * side_length);

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