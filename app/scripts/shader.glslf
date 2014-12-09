
uniform vec3 ambientLightColor;

#if MAX_DIR_LIGHTS > 0
uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
#endif

#if MAX_HEMI_LIGHTS > 0
uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];
uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];
uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];
#endif

#if MAX_POINT_LIGHTS > 0
uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];
uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];
uniform float pointLightDistance[ MAX_POINT_LIGHTS ];
#endif

#if MAX_SPOT_LIGHTS > 0
uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];
uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];
uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];
uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];
uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];
uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];
#endif

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

uniform vec3 color;

void main(void)
{
  vec3 col = vec3(1.0,0.0,0.5);
  gl_FragColor = vec4(color+pointLightColor[0], 1.0);
}
