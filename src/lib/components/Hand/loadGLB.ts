import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

export function loadGLB(path: string) {
	return new Promise<GLTF>((resolve, reject) => {
		loader.load(
			path,
			(gltf) => resolve(gltf),
			undefined,
			(error) => reject(error)
		);
	});
}
