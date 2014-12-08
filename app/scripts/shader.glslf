
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

void main(void)
{

  vec3 tc = vec3(1.0,0.0,0.5);
  gl_FragColor = vec4(tc, 1.0);
}
