/*global define*/
'use strict';
define(['THREE', 'Shaders/PostUniforms', 'text!Shaders/Chunks/post/default.glslv', 'text!Shaders/Chunks/post/default_pars.glslv', 'text!Shaders/Chunks/init.glslf', 'text!Shaders/Chunks/post/init_pars.glslf'],
function(THREE ,  postUniforms         ,  defaultVertex                          ,  defaultVertexPars                           ,fragInit                       ,  fragInitPars                        ){
  var Shader = {
    uniforms: THREE.UniformsUtils.merge([
      postUniforms,
      {
      }
    ]),
    vertexShader: [
      defaultVertexPars,
      'void main() {',
      defaultVertex,
      '}'
    ].join('\n'),
    fragmentShader: [
      fragInitPars,
      'void main() {',
      fragInit,
      '  mat2 transform = mat2(0.0,1.0,1.0,0.0);',
      '  gl_FragColor*=texture2D (tDiffuse, vUv*transform);',
      '}'
    ].join('\n')
  };
  return Shader;
});
