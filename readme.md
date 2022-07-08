# OpenSquare Team Rich Text Editor

## Release

commit message follow these below:

- `feat: message` minor release
- `fix: message` patch release

## Directory

```
├── demo
│   ├── modify here if you want to test out under yarn dev
│   └── index.tsx
├── src
│   ├── for now, the only one thing we will care is index.tsx
│   ├── which is the enterance of the whole project
│   └── index.tsx
├── some config files
│   └── we will try to remove some unnecessary ones
```

## Demo

`yarn dev`

## Development

Basically we test out everything in `demo/index.tsx` and
migrate changes to `src/index.tsx`

## Controllers & Commands

The v12 version of react-mde represents us a head-less lib,
which gives us full control of everything, but we need to
compose all into a component ourselves.

## Styling

we want to figure out a nice clean way to do styings.
