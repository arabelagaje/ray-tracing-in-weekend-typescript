export class Vector3 {
    private _x: number;
    private _y: number;
    private _z: number;
    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get z(): number {
        return this._z;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    set z(z: number) {
        this._z = z;
    }

    addTo(vector3: Vector3) {
        this._x += vector3.x;
        this._y += vector3.y;
        this._z += vector3.z;
    }

    subtractFrom(vector3: Vector3) {
        this._x -= vector3.x;
        this._y -= vector3.y;
        this._z -= vector3.z;
    }

    multiplyBy(iCount: number) {
        this._x *= iCount;
        this._y *= iCount;
        this._z *= iCount;
    }

    divideBy(iCount: number) {
        this._x /= iCount;
        this._y /= iCount;
        this._z /= iCount;
    }

    add(vector3: Vector3): Vector3 {
        return new Vector3(this._x + vector3.x, this._y + vector3.y, this._z + vector3.z);
    }

    subtract(vector3: Vector3): Vector3 {
        return new Vector3(this._x - vector3.x, this._y - vector3.y, this._z - vector3.z);
    }

    multiply(iCount: number): Vector3 {
        return new Vector3(this._x * iCount, this._y * iCount, this._z * iCount);
    }

    divide(iCount: number): Vector3 {
        return new Vector3(this._x / iCount, this._y / iCount, this._z / iCount);
    }

    length(): number {
        return Math.sqrt(this.squaredLength());
    }

    squaredLength(): number {
        return (this._x * this._x) + (this._y * this._y) + (this._z * this._z);
    }
}