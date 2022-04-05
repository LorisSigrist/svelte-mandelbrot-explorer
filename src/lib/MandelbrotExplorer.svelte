<script lang="ts">
	import { onMount } from 'svelte';

	import mandelbrotRendering from './mandelbrotRendering';

	export let zoom: number = 1 / 3;
	export let focal: number[] = [0, 0];
	export let width = 300;
	export let height = 150;
	export let iterations = 500;

	export let frozen = false;

	let pixelRatio = 1;
	onMount(() => {
		pixelRatio = window.devicePixelRatio;
	});

	$: pixelWidth = width * pixelRatio;
	$: pixelHeight = height * pixelRatio;

	let pointers: PointerEvent[] = [];
	$: grabbing = !!pointers.length;

	function getDistanceBetweenTwoPointers(p1: PointerEvent, p2: PointerEvent): number {
		return Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
	}

	function pointerStart(e: PointerEvent) {
		if (frozen) return;
		e.preventDefault();
		pointers = [...pointers, e];
	}
	function pointerEnd(e: PointerEvent) {
		if (frozen) return;
		e.preventDefault();
		pointers = pointers.filter((pt) => pt.pointerId !== e.pointerId);
	}
	function pointerMove(e: PointerEvent) {
		if (frozen) return;
		e.preventDefault();

		//Pinching
		if (pointers.length >= 2) {
			const currentPinchDistance = getDistanceBetweenTwoPointers(pointers[0], pointers[1]);

			//Updating Pointer Position
			for (let i = 0; i < pointers.length; i++) {
				if (e.pointerId == pointers[i].pointerId) {
					pointers[i] = e;
					break;
				}
			}

			const newPinchDistance = getDistanceBetweenTwoPointers(pointers[0], pointers[1]);

			zoom *= newPinchDistance / currentPinchDistance;
		} else {
			//Panning
			for (let i = 0; i < pointers.length; i++) {
				if (e.pointerId == pointers[i].pointerId) {
					focal[0] -= (2 * (e.clientX - pointers[i].clientX)) / zoom / width;
					focal[1] += (2 * (e.clientY - pointers[i].clientY)) / zoom / width;

					pointers[i] = e;
					break;
				}
			}
		}
	}

	function wheelZoom(e: WheelEvent) {
		if (frozen) return;

		e.preventDefault();
		console.log(e.deltaY);
		zoom += (e.deltaY / 3000) * zoom;
	}
</script>

<div
	style={`width: ${width}px; max-height: ${height}px; ${
		frozen ? '' : `cursor:${grabbing ? 'grabbing' : 'grab'};`
	}`}
>
	<canvas
		on:pointermove={pointerMove}
		on:pointercancel={pointerEnd}
		on:pointerdown={pointerStart}
		on:pointerout={pointerEnd}
		on:pointerup={pointerEnd}
		on:pointerleave={pointerEnd}

		on:mousewheel={wheelZoom}

		width={pixelWidth}
		height={pixelHeight}
		style={`width: ${width}px; height: ${height}px; touch-action: none;`}
		use:mandelbrotRendering={{
			width,
			height,
			focalX: focal[0],
			focalY: focal[1],
			zoom: zoom * 2,
			iterations
		}}
	/>
</div>
