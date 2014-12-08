/*global define*/
'use strict';
define(['THREE'],
function(THREE)
{
  var Shape = function(height, width, breadth)
  {
    THREE.Geometry.call(this);
    this.type = 'ShapleyShape';
    var s = [height,width,breadth];
    var c = [0,0,0]
    var verts = new THREE.Geometry();
    for(var v=0; v<8; ++v)
    {
      var vert = [];
      var flump='';
      for(var d in s)
      {
        if((v>>d) & 1)
        {
          vert.push(c[d]+s[d]/2);
          flump+='1';
        }
        else
        {
          vert.push(c[d]-s[d]/2);
          flump+='0';
        }
      }
      //console.log(flump);
       this.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
    }
    this.faces.push(new THREE.Face3(0,1,2));
  };
  Shape.prototype = Object.create(THREE.Geometry.prototype);
  /*Shape.prototype = {
    constructor: Shape
  }*/
  
  return Shape;
});
