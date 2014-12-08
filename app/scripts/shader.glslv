attribute vec3 aVertexPosition;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying highp vec3 thing;

highp vec3 lighter(vec3 direction, vec3 colour, vec3 vertex)
{
  highp float directional = max(dot(vertex, direction), 0.0);
  return colour * directional;
}

void main(void)
{
  highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
  highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
  highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);
  highp float directional = max(dot(aVertexPosition.xyz, directionalVector), 0.0);
  thing = ambientLight +lighter(directionalVector, directionalLightColor, aVertexPosition.xyz);
  gl_Position = projection * view * model * vec4(aVertexPosition, 1.0);
  
}
