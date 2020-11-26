import { RGB, RGBA, HSL, HSLA, HSV, HSVA, HEX } from './types';
import * as convert from './converters'

export class Color {
    // Private
    private _rgba255: RGBA
    private _rgba1: RGBA

    private _rgb255: RGB
    private _rgb1: RGB

    private _intValue: number

    private _hsva: HSVA
    private _hsv: HSV

    private _hsla: HSLA
    private _hsl: HSL

    private _hex: HEX

    private constructor(rgba255: RGBA) { this._rgba255 = rgba255 }

    // Public getters
    get rgba255(): RGBA {
        return this._rgba255
    }
    get rgba1(): RGBA {
        if (!this._rgba1) this._rgba1 = convert.rgba255ToRgba1(this._rgba255)

        return this._rgba1
    }

    get rgb255(): RGB {
        if (!this._rgb255) this._rgb255 = convert.rgbaToRgb(this._rgba255)

        return this._rgb255
    }
    get rgb1(): RGB {
        if (!this._rgb1) this._rgb1 = convert.rgbaToRgb(this.rgba1)

        return this._rgb1
    }

    get intValue(): number {
        if (!this._intValue) this._intValue = convert.rgba255ToInt(this._rgba255)

        return this._intValue
    }

    get hsva(): HSVA {
        if (!this._hsva) this._hsva = convert.rgba255ToHsva(this._rgba255)

        return this._hsva
    }
    get hsv(): HSV {
        if (!this._hsv) this._hsv = convert.hsvaToHsv(this._hsva)

        return this._hsv
    }

    get hsla(): HSLA {
        if (!this._hsla) this._hsla = convert.rgba255ToHsla(this._rgba255)

        return this._hsla
    }
    get hsl(): HSL {
        if (!this._hsl) this._hsl = convert.hslaToHsl(this._hsla)

        return this._hsl
    }

    get hex(): HEX {
        if (!this._hex) this._hex = convert.rgba255ToHex(this._rgba255)

        return this._hex
    }

    get rgb255Sum() { return this.rgba255.r + this.rgba255.g + this.rgba255.b }
    get rgba255Sum() { return this.rgb255Sum + this.rgba255.a }
    get rgb255Avg() { return this.rgb255Sum / 3 }
    get rgba255Avg() { return this.rgba255Sum / 4 }

    get rgb1Sum() { return this.rgba1.r + this.rgba1.g + this.rgba1.b }
    get rgba1Sum() { return this.rgb1Sum + this.rgba1.a }
    get rgb1Avg() { return this.rgb1Sum / 3 }
    get rgba1Avg() { return this.rgba1Sum / 4 }

    get isDark() { return this.rgb255Avg < 127 }
    get isLight() { return !this.isDark }
    get inverted() { return Color.rgba255(255 - this.rgba255.r, 255 - this.rgba255.g, 255 - this.rgba255.b, this.rgba255.a) }

    // Public methods
    substract(color: Color, a: number = null, allowNegative: boolean = false) {
        var r = this.rgba255.r - color.rgba255.r
        var g = this.rgba255.g - color.rgba255.g
        var b = this.rgba255.b - color.rgba255.b
        if (!a) a = this.rgba255.a == color.rgba255.a ? this.rgba255.a : 255

        if (r < 0 && !allowNegative) r = 0
        if (g < 0 && !allowNegative) g = 0
        if (b < 0 && !allowNegative) b = 0
        if (a < 0 && !allowNegative) a = 0

        return Color.rgba255(r, g, b, a)
    }

    diff(color: Color, a: number = null) {
        return Color.rgba255(
            Math.abs(this.rgba255.r - color.rgba255.r),
            Math.abs(this.rgba255.g - color.rgba255.g),
            Math.abs(this.rgba255.b - color.rgba255.b),
            a ? a : (this.rgba255.a == color.rgba255.a ? this.rgba255.a : 255)
        )
    }

    add(color: Color, a: number = 255, allowOverFlow: boolean = false) {
        var r = this.rgba255.r - color.rgba255.r
        var g = this.rgba255.g - color.rgba255.g
        var b = this.rgba255.b - color.rgba255.b
        if (!a) a = this.rgba255.a == color.rgba255.a ? this.rgba255.a : 255

        if (r > 255 && !allowOverFlow) r = 255
        if (g > 255 && !allowOverFlow) g = 255
        if (b > 255 && !allowOverFlow) b = 255
        if (a > 255 && !allowOverFlow) a = 255

        return Color.rgba255(r, g, b, a)
    }

    mix(color: Color, a: number = null) {
        return Color.rgba255(
            (this.rgba255.r - color.rgba255.r) / 2,
            (this.rgba255.g - color.rgba255.g) / 2,
            (this.rgba255.b - color.rgba255.b) / 2,
            a ?? (this.rgba255.a + color.rgba255.a) / 2
        )
    }

    divide(div: number, a: number = null) { return this.multiply(1 / div, a) }
    multiply(multiplier: number, a: number = null, allowOverFlow: boolean = false) {
        var r = this.rgba255.r * multiplier
        var g = this.rgba255.g * multiplier
        var b = this.rgba255.b * multiplier

        if (r > 255 && !allowOverFlow) r = 255
        if (g > 255 && !allowOverFlow) g = 255
        if (b > 255 && !allowOverFlow) b = 255

        return Color.rgba255(r, g, b, a ?? this.rgba255.a)
    }

    lighter(perc: number = 0.1) { return this.multiply(1 + perc) }
    darker(perc: number = 0.1) { return this.lighter(-perc) }

    shades(count: number = 10): Color[] {
        var colors: Color[] = []
        const step = 255 / count
        var darkerCount = this.rgb255Avg / step
        var lighterCount = count - darkerCount

        if (darkerCount > lighterCount) { darkerCount -= 1 } else { lighterCount -= 1 }

        while (darkerCount > 0) {
            colors.push(this.substract(Color.rgb255(step*darkerCount, step*darkerCount, step*darkerCount), this.rgba255.a, false))
            darkerCount -= 1
        }

        colors.push(this)

        while (lighterCount > 0) {
            colors.push(this.add(Color.rgb255(step*lighterCount, step*lighterCount, step*lighterCount), this.rgba255.a, false))
            lighterCount -= 1
        }

        return colors
    }

    shadesByPercentage(count: number = 10, startStep: number = 0.01): Color[] {
        var colors: Color[] = []
        const step = 1 / (count / 2)
        var currentStep = startStep

        while (currentStep < 2) {
            colors.push(this.multiply(currentStep, this.rgba255.a, false))
            currentStep += step
        }

        return colors
    }

    // Public static constructors

    // 0-255 each
    static rgba255(r: number, g: number, b: number, a: number) {
        return new Color({ r: Math.round(r), g: Math.round(g), b: Math.round(b), a: Math.round(a) })
    }
    // 0-1 each
    static rgba1(r: number, g: number, b: number, a: number) {
        return new Color(convert.rgba1ToRgba255({ r: r, g: g, b: b, a: a }))
    }

    // 0-255 each
    static rgb255(r: number, g: number, b: number) { return Color.rgba255(r, g, b, 255) }
    // 0-1 each
    static rgb1(r: number, g: number, b: number) { return Color.rgba1(r, g, b, 1) }

    // Int
    static int(val: number) { return new Color(convert.intToRgba255(val)) }

    // h in [0-360], s & v in [0-1], a in [0-255]
    static hsva(h: number, s: number, v: number, a: number) { return new Color(convert.hsvaToRgba255({ h: h, s: s, v: v, a: a })) }
    // h in [0-360], s & v in [0-1]
    static hsv(h: number, s: number, v: number) { return Color.hsva(h, s, v, 255) }

    // h in [0-360], s & l in [0-1], a in [0-255]
    static hsla(h: number, s: number, l: number, a: number) { return new Color(convert.hslaToRgba255({ h: h, s: s, l: l, a: a })) }
    // h in [0-360], s & l in [0-1]
    static hsl(h: number, s: number, l: number) { return Color.hsva(h, s, l, 255) }

    // h in [0-360], s & l in [0-1]
    static hex(hex: HEX) { return new Color(convert.hexToRgba255(hex)) }
}