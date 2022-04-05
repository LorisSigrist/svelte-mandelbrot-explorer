import vertexShaderCode from './shaders/vertex'
import fragmentShaderCode from './shaders/fragment'

interface MandelbrotRenderingParameters {
	width: number
	height: number
	iterations: number
	focalX: number
	focalY: number
	zoom: number
}

function mandelbrotRendering (canvas: HTMLCanvasElement, o: MandelbrotRenderingParameters) {

    const gl = canvas.getContext("webgl")
    if(!gl){
        console.error("MANDELBROT EXPLORER: Could not initialize WebGL")
        return;
    }

    //Create the Rectangle
    const vertexBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()
    const vertices = [-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]
    const indecies = [3, 2, 1, 3, 1, 0]
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indecies),
      gl.STATIC_DRAW
    )

    //Initialize Shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderCode)
    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        'MANDELBROT EXPLORER:: Could not compile vertex shader',
        gl.getShaderInfoLog(vertexShader)
      )
      gl.deleteShader(vertexShader)
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentShaderCode)
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        'MANDELBROT EXPLORER: Could not compile fragment shader',
        gl.getShaderInfoLog(fragmentShader)
      )
      gl.deleteShader(fragmentShader)
    }

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('MANDELBROT EXPLORER: Could not link program')
      gl.deleteProgram(program)
    }
    gl.useProgram(program)

    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)


	function rerender () {
		const positionAttributeLocation = gl.getAttribLocation(
            program,
            'position'
          )
          gl.vertexAttribPointer(
            positionAttributeLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
          )
          gl.enableVertexAttribArray(positionAttributeLocation)
      
          //Set uniforms
          const translationMatrixPosition = gl.getUniformLocation(
            program,
            'translation_matrix'
          )
          gl.uniformMatrix3fv(translationMatrixPosition, false, [
            o.width / o.height / o.zoom,
            0,
            0,
            0,
            1 / o.zoom,
            0,
            o.focalX,
            o.focalY,
            1
          ])
      
          const angleOffsetPosition = gl.getUniformLocation(
            program,
            'angleOffset'
          )
          gl.uniform1f(angleOffsetPosition, 0)
      
          const iterationPosition = gl.getUniformLocation(
            program,
            'maxIterations'
          )
          gl.uniform1f(iterationPosition, o.iterations)
      
          gl.clearColor(0, 0, 1, 1)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          gl.viewport(
            0,
            0,
            o.width * window.devicePixelRatio,
            o.height * window.devicePixelRatio
          )
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

	}

	let frame: number | undefined
	function invalidate () {
		if (!frame) {
			frame = requestAnimationFrame(() => {
				rerender()
				frame = undefined
			})
		}
	}
	invalidate()

	return {
		update (newOptions) {
			o = newOptions
			invalidate()
			return
		},
		destroy () {
			if (frame) cancelAnimationFrame(frame)
			return
		}
	}
}

export default mandelbrotRendering
