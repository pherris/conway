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

## Performance

This implementation ultimately is not suitable for as large a galaxy as implemented (assuming patterns that create a virtually unbounded number of selected squares).  The performance of this application degrades in exponentially in relationship to the number of objects created.  Moving to a hashed lookup would improve performance greatly.

Benchmarking

- 500 frames, 62839ms
- optimization 1 (use raw list in perform method)
- 500 frames, 59633ms
- optimization 2 remove a lookup
- 500 frames, 60305ms
- optimization 3 don't serialize json on every frame
- 500 frames, 57464ms