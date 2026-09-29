import { useEffect, useRef } from 'react'

// "SURVEY_PROGRAM"
// BY Yxuer - 2026
//
// On ShaderToy: https://www.shadertoy.com/view/N3KGzm
//
// Resources:
//   - "Volumetric Glow" (https://www.shadertoy.com/view/W3tSR4)
//     by Xor
//   - "Sun Water Clouds (refactor)" (https://www.shadertoy.com/view/Wf33Df)
//     by PrzemyslawZaworski
//     [NOTE: the volume function employed here is almost the same as this one]
//
// License:
//   - MIT License
//     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


const vertexShaderSource = `#version 300 es
const vec2 positions[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);

void main() {
  gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}`

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
out vec4 fragColor;

float vol(vec3 p) {
  for (float i = 0.05; i < 1.0; i += i) {
    p += abs(dot(sin(i * p * 16.0 + iTime * 0.5 + p.z), vec3(0.01))) / i * 1.5;
  }
  return 0.03 + abs(2.0 - p.y) * 0.2;
}

void main() {
  vec2 center = abs(2.0 * gl_FragCoord.xy - iResolution);
  vec3 rd = normalize(vec3(center, iResolution.y));
  vec3 pos = vec3(0.0, 0.0, iTime * 0.5);
  float col = 0.0;

  for (int i = 0; i < 100; i++) {
    float v = vol(pos);
    pos += rd * v;
    col += 1.0 / v;
  }

  float cf = pow(smoothstep(0.06, 0.6, 2.0 / (1.0 + exp(-2.0 * (col / 6000.0))) - 1.0), 0.5);
  fragColor = mix(vec4(0.1, 0.1, 0.4, 1.0), vec4(1.0), cf);
}`

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl2', { alpha: true, antialias: false })
    if (!canvas || !gl) return

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      return
    }

    const resolutionLocation = gl.getUniformLocation(program, 'iResolution')
    const timeLocation = gl.getUniformLocation(program, 'iTime')
    const startTime = performance.now()
    let frameId = 0

    const render = (now: number) => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.floor(canvas.clientWidth * pixelRatio)
      const height = Math.floor(canvas.clientHeight * pixelRatio)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      gl.viewport(0, 0, width, height)
      gl.useProgram(program)
      gl.uniform2f(resolutionLocation, width, height)
      gl.uniform1f(timeLocation, (now - startTime) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frameId = window.requestAnimationFrame(render)
    }

    frameId = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(frameId)
      gl.deleteProgram(program)
    }
  }, [])

  return <canvas ref={canvasRef} className="shader-background" aria-hidden="true" />
}

export default ShaderBackground