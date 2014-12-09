vec3 psx(vec3 pos, float res)
{
  lowp ivec3 lpos = ivec3(res*pos);
  return vec3(lpos)/res;
}
