#define RES 11.0

varying vec3 vPos;

void main(void)
{
  vPos = vec3(RES * viewMatrix * modelMatrix * vec4( position, 1.0 ));
  lowp ivec4 lpos = ivec4(RES * viewMatrix * modelMatrix * vec4( position, 1.0 ));
  gl_Position = projectionMatrix * (vec4(lpos)/RES);
}
