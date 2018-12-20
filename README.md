# Conway's Game of Life

This is a typescript implementation transpiled to JS using Parcel (https://parceljs.org).

## Install

Install Parcel with:

`yarn global add parcel-bundler`

and install requirements with:

`yarn install`

## Run 

To run the code:

`parcel index.html`

Tests:

`yarn test`

## Implementation

Each `Point` object is aware of:
 - its coordinates
 - weather or not it is `selected`
 - its neighbor's coordinates 

`CachedPoints` holds a lookup Object who's keys are the coordinates of the `Point`s & values are the `Point`s themselves.

`index.ts` is the entry point for the application, bridging (and creating) the DOM with the cache logic:

 - `addPoint` adds a point with initial state to the cache.
 - `syncUi` updates the DOM's representation of the current state of the Universe.  Every 500 frames the application pauses to allow for examination.
 - `perform` implements the rules of the game & is recursively called as quickly as possible using a `setTimeout` with no delay.

 `*_spec.ts` hold some basic tests run with `karma` and `karma-jasmine`

## Benchmarking

- 500 frames, 62839ms
- optimization 1 (use raw list in perform method)
- 500 frames, 59633ms
- optimization 2 remove a lookup
- 500 frames, 60305ms
- optimization 3 don't serialize json on every frame
- 500 frames, 57464ms
- Moved to the hash lookup
- 500 frames, 9750ms
- Moved to leaving items in lookup hash, smarter about when to query for DOM nodes
- 500 frames, 7073ms
