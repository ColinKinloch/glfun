/*global define*/
'use strict';
define(['THREE', 'text!Shaders/Chunks/psx.glslv'],
function(THREE,   psxshad){
  var Shader = {
    vertexColors:THREE.VertexColors,
    color: new THREE.Color(0xff0f00),
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib[ 'common' ],
      THREE.UniformsLib[ 'lights' ],
      {
        'ambient'  : { type: 'c', value: new THREE.Color( 0xff00aa ) },
        'emissive' : { type: 'c', value: new THREE.Color( 0x0f000f ) },
        'wrapRGB'  : { type: 'v3', value: new THREE.Vector3( 1, 1, 1 ) }
      }
    ]),
    vertexShader:  [
      psxshad,
      '#define LAMBERT',
      "varying vec3 vLightFront;",
      "#ifdef DOUBLE_SIDED",
      "	varying vec3 vLightBack;",
      "#endif",
      THREE.ShaderChunk[ 'lights_lambert_pars_vertex' ],
      THREE.ShaderChunk[ 'color_pars_vertex' ],
      'void main() {',
        THREE.ShaderChunk[ 'color_vertex' ],
        /*'vec4 mvPosition;',
        '#ifdef USE_SKINNING',
        ' mvPosition = modelViewMatrix * skinned;',
        '#endif',
        '#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )',
        ' mvPosition = modelViewMatrix * vec4( morphed, 1.0 );',
        '#endif',
        '#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )',
        ' mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        '#endif',
        'gl_Position = projectionMatrix * vec4(psx(vec3(mvPosition),11.0), 1.0);',*/
        THREE.ShaderChunk[ 'default_vertex' ],
        'gl_Position = psx(gl_Position, 11.0);',
        THREE.ShaderChunk[ 'defaultnormal_vertex' ],
        THREE.ShaderChunk[ "lights_lambert_vertex" ],
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform float opacity;',
      'varying vec3 vLightFront;',
      '#ifdef DOUBLE_SIDED',
      '	varying vec3 vLightBack;',
      '#endif',
      THREE.ShaderChunk[ 'lights_lambert_pars_vertex' ],
      'uniform vec3 uColor;',
      THREE.ShaderChunk[ 'color_pars_fragment' ],
      'void main() {',
        'gl_FragColor = vec4( vec3( 1.0 ), opacity );',
        THREE.ShaderChunk[ "color_fragment" ],
        '#ifdef DOUBLE_SIDED',
        '  if(gl_frontFacing)',
        'gl_FragColor.xyz *= vLightFront',
        'else',
        'gl_FragColor.xyz *= vLightBack',
        '#else',
        'gl_FragColor.xyz *= vLightFront;',
        '#endif',
      '}'
    ].join("\n"),
    wireframe: true,
    lights: true,
  };
  return Shader;
});
