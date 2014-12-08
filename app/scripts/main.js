/*global require*/
/*jslint bitwise: true */
'use strict';
require.config({
  baseUrl: 'scripts',
  paths: {
    'gl-matrix': '../bower_components/gl-matrix/dist/gl-matrix',
    'jquery': '../bower_components/jquery/dist/jquery',
    'bootstrap': '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
    'text': '../bower_components/requirejs-text/text'
  },
  shim: {
    bootstrap: ['jquery']
  }
});
require([ 'jquery', 'gl-matrix', 'Entity', 'text!shader.glslf', 'text!shader.glslv' ],
function(   $       ,  glm       ,  Entity ,  fragshad          ,  vertshad           ){
  var canvas = $('#main');
  var resize = function(e)
  {
    var w = e.target.innerWidth;
    var h = e.target.innerHeight;
    var r = w/h;
    canvas.attr('width', w+'px');
    canvas.attr('height', h+'px');
    gl.viewport(0, 0, w, h);
    var pMatrix = glm.mat4.perspective(glm.mat4.create(),50, r, 0.1, 3000);
    var pMatrix = glm.mat4.ortho(glm.mat4.create(), -w/2,w/2,-h/2,h/2,0.1,3000);
    //pMatrix = math.multiply(glm.scale(0.5,1,0.5),pMatrix);
    var pUniform = gl.getUniformLocation(shaderProgram, "projection");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(pMatrix));
    
    var vMatrix = glm.mat4.create();
    var vUniform = gl.getUniformLocation(shaderProgram, "view");
    gl.uniformMatrix4fv(vUniform, false, new Float32Array(vMatrix));
  };
  $(window).resize(resize);
  var glprops = {antialias: false};
  var gl = canvas[0].getContext('experimental-webgl2', glprops) || canvas[0].getContext('webgl', glprops) || canvas[0].getContext('experimental-webgl', glprops);
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width(), canvas.height());
  
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(fragmentShader, fragshad);
  gl.shaderSource(vertexShader, vertshad);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {  
      console.error("An error occurred compiling the shaders: ", gl.getShaderInfoLog(fragmentShader));  
      return null;  
  }
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {  
      console.error("An error occurred compiling the shaders: ", gl.getShaderInfoLog(vertexShader));  
      return null;  
  }
  
  
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, fragmentShader);
  gl.attachShader(shaderProgram, vertexShader);
  gl.linkProgram(shaderProgram);
  
  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
  {
    console.error('shader program not linked.');
  }
  
  gl.useProgram(shaderProgram);
  
  var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  
  var squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  
  var Shape = function (s,c)
  {
    for(var d in s)
     s[d] = s[d]/2;
    var verts = new Array();
    for(var v=0; v<8; ++v)
    {
      var vert = [];
      var flump='';
      for(d in s)
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
      for(var i in vert)
       verts.push(vert[i]);
    }
    return verts;
  };
  
  var vertices = Shape([500,500,500], [0,0,0]);
  //var ent = new Entity(gl, vertices);
  //ent.pos.x += 100;
  
  //gl.bufferData(gl.ARRAY_BUFFER, math.flatten(vertices).toArray(), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.lineWidth(window.devicePixelRatio || 1);
  
  $(window).resize();
  var t = window.performance.now();
  var time = window.performance.now();
  var loop = function(t, frame)
  {
    
  };
  var main = function()
  {
    var now = window.performance.now();
    var frame = now - time;
    time = now;
    loop(t,frame);
    t += frame;
  };
  var draw = function()
  {
    var mMatrix = glm.mat4.create();
    //mMatrix = glm.mat4.rotateY(glm.mat4.create(), mMatrix, t*0.0007);
    mMatrix = glm.mat4.translate(glm.mat4.create(), mMatrix, [0,0,2+Math.cos(t*0.005)*0]);
    mMatrix = glm.mat4.rotateY(glm.mat4.create(), mMatrix, t*0.0005);
    var mUniform = gl.getUniformLocation(shaderProgram, "model");
    gl.uniformMatrix4fv(mUniform, false, new Float32Array(mMatrix));
    
    var vMatrix = glm.mat4.create();
    vMatrix = glm.mat4.translate(glm.mat4.create(),vMatrix,[0,0,-2000.0]);
    var vUniform = gl.getUniformLocation(shaderProgram, "view");
    gl.uniformMatrix4fv(vUniform, false, new Float32Array(vMatrix));
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length/3);
    window.requestAnimationFrame(draw);
  };
  draw();
  setInterval(main, 0);
});
