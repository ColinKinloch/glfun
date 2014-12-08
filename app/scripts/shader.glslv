#define RES 10.0

varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

void main(void)
{
  vUv = uv;
  vecPos = vec3(RES * modelViewMatrix * vec4( position, 1.0 ));
  lowp ivec4 lpos = ivec4(RES * modelViewMatrix * vec4( position, 1.0 ));
  gl_Position = projectionMatrix * (vec4(lpos)/RES);
}
