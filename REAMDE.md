# Svelte Mandelbrot Explorer

TODO: Show Preview & link to demo

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
    import MandelbrotExplorer from 'svelte-mandelbrot-explorer
    let width = 150;
    let height= 300;
</script>

<div bind:clientWidth={width} bind:clientHeight={height} id="mandelbrot-explorer-wrapper">  
    <MandelbrotExplorer {width} {height}/>
</div>

<style>
    #mandelbrot-explorer-wrapper {
        width: 100%;
        aspect-ratio: 16/9;
    }
</style>
```

## API Reference
- **width & height**
    Type: number
    Default: width=300, height=150
    Control the dimensions

- **controls**
    Type: enum("top-left" | "top-right" | "bottom-left" | "bottom-right" | "none")
    Default: "bottom-left"
    If and where the zoom-control widget should be shown

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
    Default: 0.5,
    How zoomed in the viewport should be. The viewport-width in the complex plane is equal to `1/zoom`. 

## Limitations & Considerations
Because this is a WebGl based implementation, the precision is limited. The Image breaks down after about a 100'000x zoom. 

The Canvas is only rerendered if one of the attributes changes. If you never change the attributes, it will basically be an image. 