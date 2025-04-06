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

function isometry_nearest_even(x: number, y: number): Point
{
	let result_x = Math.round(x / side_length) * side_length;
	let result_y = Math.round(y / (2 * height)) * 2 * height;

	return { x: result_x, y: result_y };
}

function isometry_nearest_odd(x: number, y: number): Point
{
	let result_x = (Math.round(x / side_length - 0.5) + 0.5) * side_length;
	let result_y = (Math.round(y / (2 * height) - 0.5) + 0.5) * 2 * height;

	return { x: result_x, y: result_y };
}

function draw(): void
{
	let nearest_even = isometry_nearest_even(cursor.x, cursor.y);
	let nearest_odd = isometry_nearest_odd(cursor.x, cursor.y);

	let closest = sqr_dst(nearest_even, cursor) < sqr_dst(nearest_odd, cursor) ? nearest_even : nearest_odd;

	// background
	ctx.fillStyle = "rgb(192, 192, 192)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// grid
	ctx.strokeStyle = "rgb(160, 160, 160)";
	draw_cartesian_grid();

	// points and hexagons
	ctx.fillStyle = "black";
	ctx.strokeStyle = "rgb(64, 64, 64)";

	draw_point(nearest_even.x, nearest_even.y);
	draw_point(nearest_odd.x, nearest_odd.y);

	draw_hexagon(nearest_even.x, nearest_even.y, Math.tan(Math.PI / 6) * side_length);
	draw_hexagon(nearest_odd.x, nearest_odd.y, Math.tan(Math.PI / 6) * side_length);

	ctx.fillStyle = "red";
	ctx.strokeStyle = "red";
	
	draw_point(closest.x, closest.y);
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