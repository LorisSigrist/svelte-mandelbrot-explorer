<script>
	import MandelbrotExplorer from '$lib';
	let width = 150;
    $: height = width / 16 * 9;

    let iterations = 500;
</script>

<div
	bind:clientWidth={width}
	style={`width: 100%; height: ${height}px;`}
>
	<MandelbrotExplorer {width} {height} {iterations}/>
</div>
<input type="range" step={0.001} min={1} max={1000} bind:value={iterations}/>
<style>
	div {
		border: 2px solid black;
	}
</style>
