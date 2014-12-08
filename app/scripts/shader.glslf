varying highp vec3 thing;

void main(void)
{
  gl_FragColor = vec4(vec3(1.0, 0.0, 0.5)*thing, 1.0);
}
