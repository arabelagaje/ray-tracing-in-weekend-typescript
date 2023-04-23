import { Vector3 } from "./Vector3.js";

export class Color extends Vector3 {
    get r(): number {
        return this.x;
    }

    get g(): number {
        return this.y;
    }

    get b(): number {
        return this.z;
    }
    set r(r: number) {
        this.x = r;
    }

    set g(g: number) {
        this.y = g;
    }

    set b(b: number) {
        this.z = b;
    }
}