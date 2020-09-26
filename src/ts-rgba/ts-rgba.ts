export class RGBA {
    r: number
    g: number
    b: number
    a: number

    constructor(r: number, g: number, b: number, a: number = 255) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    get rgbSum() { return this.r + this.g + this.b }
    get rgbAvg() { return this.rgbSum / 3 }
    get isDark() { return this.rgbAvg < 127 }
    get isLight() { return !this.isDark }
    get inverted() { return new RGBA(255 - this.r, 255 - this.g, 255 - this.b, this.a) }

    diff(rgba: RGBA, a: number = 255) {
        const r = this.r - rgba.r
        const g = this.g - rgba.g
        const b = this.b - rgba.b

        return new RGBA(r, g, b, a)
    }

    sum(rgba: RGBA, a: number = 255) {
        return new RGBA(this.r + rgba.r, this.g + rgba.g, this.b + rgba.b, a)
    }

    mix(rgba: RGBA, a: number = 255) {
        return new RGBA((this.r + rgba.r)/2, (this.g + rgba.g)/2, (this.b + rgba.b)/2, a)
    }

    divide(div: number, a: number = null) {
        return this.multiply(1 / div, a)
    }
    multiply(multiplier: number, a: number = null) {
        return new RGBA(
            this.r * multiplier < 256 ? this.r * multiplier : 255,
            this.g * multiplier < 256 ? this.g * multiplier : 255,
            this.b * multiplier < 256 ? this.b * multiplier : 255,
            a ?? this.a
        )
    }
    lighter(perc: number = 0.1) {
        return this.multiply(1 + perc)
    }
    darker(perc: number = 0.1) {
        return this.lighter(-perc)
    }
}