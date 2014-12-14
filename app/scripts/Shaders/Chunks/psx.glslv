vec3 psx(vec3 pos, float res)
{
  lowp ivec3 lpos = ivec3(res*pos);
  return vec3(lpos)/res;
}
vec4 psx(vec4 pos, float res)
{
  lowp ivec4 lpos = ivec4(res*pos);
  return vec4(lpos)/res;
}
