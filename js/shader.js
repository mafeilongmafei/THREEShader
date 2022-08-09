const LinevertexShader = /*glsl*/`
            uniform float uStartTime;
			void main() {
                vec3  p = vec3(position.x , position.y , position.z * uStartTime);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
			}
        
        `
const LinefragmentShader = /*glsl*/`
        uniform vec3 Ucolor; 
         void main(){
            gl_FragColor = vec4(Ucolor , 1.0);
         }
        
        `

const linematerial = new THREE.ShaderMaterial({
    uniforms: {
        Ucolor: {
            value: new THREE.Color(0x000000)
        },
        uStartTime: null

    },

    transparent: true,
    fragmentShader: LinefragmentShader,
    vertexShader: LinevertexShader,
    side: THREE.DoubleSide

});


//================
let effect = {
    position: {
        x: 666,
        y: 22,
        z: 0
    },
    radius: 150.0,
    color: '#ff0062',
    opacity: 0.5,
    speed: 2
}

const vertexShader = /*glsl*/`
			varying vec2 vUv;
            varying vec2 vPositon;

			void main() {
				vUv = uv;
                vPositon = vec2(position.x, position.y);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                
			}
        
        `
const fragmentShader = /*glsl*/`
         float atan2(float y, float x){
                float t0, t1, t2, t3, t4;
                t3 = abs(x);
                t1 = abs(y);
                t0 = max(t3, t1);
                t1 = min(t3, t1);
                t3 = float(1) / t0;
                t3 = t1 * t3;
                t4 = t3 * t3;
                t0 = -float(0.013480470);
                t0 = t0 * t4 + float(0.057477314);
                t0 = t0 * t4 - float(0.121239071);
                t0 = t0 * t4 + float(0.195635925);
                t0 = t0 * t4 - float(0.332994597);
                t0 = t0 * t4 + float(0.999995630);
                t3 = t0 * t3;
                t3 = (abs(y) > abs(x)) ? float(1.570796327) - t3 : t3;
                t3 = (x < 0.0) ?  float(3.141592654) - t3 : t3;
                t3 = (y < 0.0) ? -t3 : t3;
                return t3;
            }
                uniform float time;
                varying vec2 vUv;
                varying vec2 vPositon;
                uniform float radius;
                uniform vec3 bColor;
                void main(){
                    vec2 center = vec2(0.0,0.0);
                    float dist = distance(center, vPositon);
                    float radianAngel = atan2(vPositon.y, vPositon.x);
                    float angle2 = mod(radianAngel+time , PI2);
                    float bump = 5.0;
                    if(dist <= radius && dist >=( radius-bump)){
                        gl_FragColor = vec4(bColor, 1.0);
                    }else if(dist <( radius-bump)){
                        float d_opacity = 1.0 - (angle2/2.0) ;
                        gl_FragColor =  vec4(bColor, d_opacity);
                    }else{
                       discard;
                }
        }
        
        `

const material = new THREE.ShaderMaterial({
    uniforms: {
        time: {
            value: 1.0,
        },
        radius: {
            value: effect.radius
        },
        bColor: {
            value: new THREE.Color(effect.color)
        }

    },
    defines: {
        PI: 3.14159265359,
        PI2: 6.28318530718,
    },
    transparent: true,
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    side: THREE.DoubleSide

});





// =========================================================








const wallData = [{
    position: {
        x: -150,
        y: 15,
        z: 100
    },
    speed: 0.5,
    color: '#efad35',
    opacity: 0.6,
    radius: 420,
    height: 120,
    renderOrder: 5
},]



const WallvertexShader = /*glsl*/`
           uniform vec3 u_color;

        uniform float time;
        uniform float u_height;
        
        varying float v_opacity;

        void main() {

            vec3 vPosition = position * mod(time, 1.0);

            v_opacity = mix(1.0, 0.0, position.y / u_height);
        
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
        }
        
        `
const WallfragmentShader = /*glsl*/`
                uniform vec3 u_color;
                uniform float u_opacity;
                
                varying float v_opacity;

                void main() { 
                    gl_FragColor = vec4(u_color, v_opacity * u_opacity);
                }
                        
        
        `

function wall(option = {}) {
    const {
        radius,
        height,
        opacity,
        color,
        speed,
        renderOrder
    } = option;
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
    // geometry.translate(0, height / 2, 0);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_height: {
                value: height
            },
            u_speed: {
                value: speed || 1
            },
            u_opacity: {
                value: opacity
            },
            u_color: {
                value: new THREE.Color(color)
            },
            time: zTime
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        vertexShader: WallvertexShader,
        fragmentShader: WallfragmentShader
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = renderOrder || 1;
    return mesh;
}


