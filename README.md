# Svelte Mandelbrot Explorer

![Mandelbrot Explorer preview image](/preview-image.png)

Try the demo [here](https://www.sigrist/blog/svelte-webgl-mandelbrot)

## Installation & Usage

Install this component into your svelte or sveltekit application running `npm i svelte-mandelbrot-explorer`. You can then use it like this:

```jsx
<script>
    import MandelbrotExplorer from 'svelte-mandelbrot-explorer'
</script>

<MandelbrotExplorer/>
```

The component defaults to a canvas size of 300x150. This is the default size of the `<canvas>` element. You should probably bind the width and height to that of a wrapper `<div>`. Like so:

```jsx
<script>
	import MandelbrotExplorer from '$lib';
	let width = 150;
    $: height = width / 16 * 9; //Preserve 16/9 aspect ratio
</script>

<div
	bind:clientWidth={width}
	style={`width: 100%; height: ${height}px;`}
>
	<MandelbrotExplorer {width} {height} />
</div>
```

## API Reference

- **width & height**


    Type: number


    Default: width=300, height=150


    Control the dimensions

- **frozen**


    Type: boolean


    Default: false


    If true, all interactivity is disabled and only a static image is shown

- **iterations**


    Type: number


    Default: 500


    The maximum number of iterations for drawing the mandelbrot set. Higher iteration count results in higher accuracy, but slows down rendering.

- **focalPoint**


    Type: [number,number]


    Default [0,0]


    Where on the complex plane the viewport should be centered.

- **zoom**


    Type: number,


    Default: 0.3333333333,


    How zoomed in the viewport should be. The viewport-width in the complex plane is equal to `1/zoom`.

## Limitations & Considerations

Because this is a WebGl based implementation, the precision is limited. The Image breaks down after about a 50'000x zoom.

The Canvas is only rerendered if one of the attributes changes. If you never change the attributes, it will basically be an image.
