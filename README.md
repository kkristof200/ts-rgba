# ts-rgba

## Description

rgba utils written in typescript

## Install

```bash
npm i ts-rgba
```

## Usage

```typescript
import { RGBA } from 'ts-rgba'

const black = new RGBA(0,0,0)
console.log(black)
console.log(black.inverted)
console.log(black.lighter(0.1).darker(0.05))
console.log(black.mix(new RGBA(255,255,255)))
console.log(black.rgbAvg)
```
