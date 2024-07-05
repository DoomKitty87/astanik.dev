#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 rotateY(vec3 p, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec3(
    c * p.x + s * p.z,
    p.y,
    -s * p.x + c * p.z
  );
}

float sdRoundBox(vec3 p, vec3 b, float r, vec2 uv, float m) {
  float noise = snoise(uv * 0.5);
  float offset = noise;
  float rotation = noise * 0.5;
  
  p = rotateY(p, rotation);
  p = p + vec3(0., offset * m, 0.);
  vec3 q = abs(p) - b + r;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float round (float x) {
  return floor(x + 0.5);
}

vec3 round (vec3 x) {
  return vec3(round(x.x), round(x.y), round(x.z));
}

float map(vec3 p) {
  vec3 scaling = vec3(1., 1.0, 0.3);
  vec3 q = p - scaling * round(p / scaling);
  q.y = p.y;
  
  float d = sdRoundBox(q, vec3(0.5, 0.1, 0.1), 0.1, p.xz * 0.1 + u_time * 0.05, 1.);

  return d;
}

vec3 norm(vec3 p) {
  return normalize(vec3(
        map(p + vec3(0.01, 0.0, 0.0)) - map(p - vec3(0.01, 0.0, 0.0)),
        map(p + vec3(0.0, 0.01, 0.0)) - map(p - vec3(0.0, 0.01, 0.0)),
        map(p + vec3(0.0, 0.0, 0.01)) - map(p - vec3(0.0, 0.0, 0.01))
      ));
}

vec3 noiseColor(vec3 p) {
  p *= 0.5;
  // Cycles through the colors of the rainbow
  // return vec3(0.5) + 0.25 * sin(vec3(0.1, 0.2, 0.3) * p + vec3(0.0, 2.0, 4.0) + u_time * 0.2);
  
  // Stays in green and yellow pastels
  return vec3(0.5) + 0.25 * abs(sin(vec3(0.1, 0.2, 0.0) * p + vec3(4.0, 2.0, 0.0) + u_time * 0.2));
}

vec3 march(vec3 ro, vec3 rd) {
  float t = 0.0;
  for (int i = 0; i < 100; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    if (d < 0.001) {
      // Compute shading
      //vec3 n = norm(p);
      //float d = dot(n, normalize(vec3(1.0, 1.0, 1.0)));
      return noiseColor(p * 0.8);
    }
    t += d;
  }
  return vec3(1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  float t = u_time * 0.1;
  vec3 cameraPosition = vec3(0.1, 8.1, 0.0);
  vec3 cameraTarget = vec3(2.0, 0., 2.);

  float cameraFov = 1.0;
  vec2 uv = (2.0 * fragCoord - u_resolution) / u_resolution.y;

  vec3 forward = normalize(cameraTarget - cameraPosition);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);

  vec3 rayDirection = normalize(forward + uv.x * right + uv.y * up)
    * tan(cameraFov * 0.5);
  vec3 color = march(cameraPosition, rayDirection);
  fragColor = vec4(color, 1.0);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
