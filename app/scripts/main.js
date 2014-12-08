/*global require*/
/*jslint bitwise: true */
'use strict';
require.config({
  baseUrl: 'scripts',
  paths: {
    'gl-matrix': '../bower_components/gl-matrix/dist/gl-matrix',
    'jquery': '../bower_components/jquery/dist/jquery',
    'bootstrap': '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
    'text': '../bower_components/requirejs-text/text',
    'THREE': '../bower_components/threejs/build/three'
  },
  shim: {
    bootstrap: ['jquery'],
    THREE: {
      exports: 'THREE'
    }
  }
});
require([ 'jquery', 'THREE', 'gl-matrix', 'Shape', 'text!shader.glslf', 'text!shader.glslv' ],
function(  $      ,  THREE ,  glm       ,  Shape ,  fragshad          ,  vertshad           )
{
  var canvas = $('#main');
  var scene = new THREE.Scene();
  
  var renderer = new THREE.WebGLRenderer({canvas:canvas[0], antialias: false});
  //renderer.setSize( window.innerWidth, window.innerHeight );
  //document.body.appendChild( renderer.domElement );
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
  var light = new THREE.AmbientLight( 0x0f0 ); // soft white light
  scene.add( light );
  
  var light = new THREE.PointLight( 0xff0000, 1, 100 );
  light.position.set( 25, 50, 50 );
  scene.add( light );
  
  var geometry = new THREE.BoxGeometry( 5, 5, 5 );
  var geometry = new THREE.SphereGeometry( 5, 20, 10 );
  var geometry2 = new THREE.BoxGeometry( 2, 2, 2 );
  
  /*var Shape = function (s,c)
  {
    for(var d in s)
     s[d] = s[d]/2;
    var verts = new THREE.Geometry();
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
       verts.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
    }
    return verts;
  };*/
  /*var shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, 1 );
  shape.lineTo( 3, 2 );
  shape.lineTo( 5, 0 );
  shape.lineTo( 0, 2 );
  var geometry = new THREE.ShapeGeometry(shape);*/
  //var geometry = new Shape(3,3);
  //geometry.faces.push(new THREE.Face3(0,1,2,3));
  
  var material2 = new THREE.MeshPhongMaterial( {
    ambient: 0xaaa,
    color: 0xdddddd,
    specular: 0x009900,
    shininess: 30,
    shading: THREE.FlatShading
  } );
  var material = new THREE.ShaderMaterial({
    fragmentShader: fragshad,
    vertexShader: vertshad,
    wireframe: false,
    lights: true
    //fog: true
  });
  
  
  
  var cube = new THREE.Mesh( geometry, material );
  var cube2 = new THREE.Mesh( geometry2, material2 );
  scene.add( cube );
  scene.add( cube2 );
  cube2.position.z =-2.5;
  cube2.rotation.z =-2;
  cube2.rotation.y =-2;

  camera.position.z = 10;
  
  var width, height;
  var resize = function(e)
  {
    var w = e.target.innerWidth;
    var h = e.target.innerHeight;
    var r = w/h;
    renderer.setSize( w, h );
    camera.aspect = r;
    camera.updateProjectionMatrix();
    width = w;
    height = h;
  };
  $(window).resize(resize);
  var mouse = new THREE.Vector2(0,0);
  var drag = function(e)
  {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  };
  canvas.mousemove(drag);
  /*
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
  
  
  
  var vertices = Shape([500,500,500], [0,0,0]);
  //var ent = new Entity(gl, vertices, shaderProgram);
  //ent.pos.x += 100;
  
  //gl.bufferData(gl.ARRAY_BUFFER, math.flatten(vertices).toArray(), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.lineWidth(window.devicePixelRatio || 1);
  */
  $(window).resize();
  var t = window.performance.now();
  var time = window.performance.now();
  var loop = function(t, frame)
  {
    camera.position.x = (mouse.x-width/2)*0.05;
    camera.position.y = (mouse.y-height/2)*0.05;
    camera.lookAt(new THREE.Vector3(0,0,0));
    cube.rotation.y = t*0.0005;
    cube.rotation.x = t*0.0007;
    cube.rotation.x = t*0.0011;
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
    window.requestAnimationFrame(draw);
    renderer.render(scene, camera);
  };
  draw();
  setInterval(main, 0);
});
