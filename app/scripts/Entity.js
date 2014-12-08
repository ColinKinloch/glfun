/*global define*/
'use strict';
define('gl-matrix',
function(glm){
  var Entity = function(context, mesh)
  {
    this.context = context;
    this.mesh = mesh;
    this.pos = glm.vec3.create();
    this.rot = glm.vec3.create();
    this.scale = glm.vec3.create();
  };
  Entity.prototype.getMatrix = function()
  {
    var model = glm.mat4.create();
    return model;
  };
  Entity.prototype.draw = function()
  {
    this.context.drawArrays(this.context.LINE_STRIP, 0, this.mesh.length/3);
  };
  return Entity;
});
