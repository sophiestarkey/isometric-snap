interface Point {
	x: number;
	y: number;
}

const canvas = document.getElementById("viewport") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const cursor: Point = { x: 0, y: 0 };
let side_length = 0;
let height = 0;

function sqr_dst(a: Point, b: Point): number
{
	return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
}

function isometry_nearest_even(point: Point): Point
{
	return {
		x: Math.round(point.x / side_length) * side_length,
		y: Math.round(point.y / (2 * height)) * 2 * height
	};
}

function isometry_nearest_odd(point: Point): Point
{
	return {
		x: (Math.round(point.x / side_length - 0.5) + 0.5) * side_length,
		y: (Math.round(point.y / (2 * height) - 0.5) + 0.5) * 2 * height
	};
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

function draw_hexagon(point: Point, side_length: number)
{
	const height = side_length * Math.sqrt(3) / 2;
	ctx.beginPath();
	ctx.moveTo(point.x, point.y - side_length);
	ctx.lineTo(point.x + height, point.y - side_length / 2);
	ctx.lineTo(point.x + height, point.y + side_length / 2);
	ctx.lineTo(point.x, point.y + side_length);
	ctx.lineTo(point.x - height, point.y + side_length / 2);
	ctx.lineTo(point.x - height, point.y - side_length / 2);
	ctx.closePath();
	ctx.stroke();
}

function draw_point(point: Point)
{
	const size = 4;
	ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
}

function draw(): void
{
	const nearest_even = isometry_nearest_even(cursor);
	const nearest_odd = isometry_nearest_odd(cursor);
	const closest = sqr_dst(nearest_even, cursor) < sqr_dst(nearest_odd, cursor) ? nearest_even : nearest_odd;

	// background
	ctx.fillStyle = "rgb(192, 192, 192)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// grid
	ctx.strokeStyle = "rgb(160, 160, 160)";
	draw_cartesian_grid();

	// points and hexagons
	ctx.fillStyle = "black";
	ctx.strokeStyle = "rgb(64, 64, 64)";

	draw_point(nearest_even);
	draw_point(nearest_odd);

	draw_hexagon(nearest_even, Math.tan(Math.PI / 6) * side_length);
	draw_hexagon(nearest_odd, Math.tan(Math.PI / 6) * side_length);

	ctx.fillStyle = "red";
	ctx.strokeStyle = "red";
	
	draw_point(closest);
	draw_hexagon(closest, Math.tan(Math.PI / 6) * side_length);

	requestAnimationFrame(draw);
}

function main(): void
{
	window.addEventListener("mousemove", (ev) => {
		cursor.x = Math.round(ev.clientX - canvas.getBoundingClientRect().left);
		cursor.y = Math.round(ev.clientY - canvas.getBoundingClientRect().top);
	});

	document.body.addEventListener("input", (ev) => {
		side_length = (document.getElementById("side_length_input") as HTMLInputElement).valueAsNumber;
		height = side_length * Math.sqrt(3) / 2;
	});

	document.body.dispatchEvent(new InputEvent("input"));
	requestAnimationFrame(draw);
}