// index.ts
import message from './message'
import { createGrid, getSelected, toggleSelected, cellIsSelected, getCellCoordinates, getCellFromCoordinates, deselectCell, selectCell } from './dom_helpers'
import { Point } from './point'
import './style.scss'

// TODO, the grid is not quite centered
// TODO, this approach isn't working due to the limit in the js number and tos

const runButton = document.getElementById('run')
const frameContainer = document.getElementById('frame')
const inputWrapper = document.getElementById('input')
let runner;

// holds the selected cells - coordinates are keys, selected is the new point
let current = {}

inputWrapper.addEventListener('click', (e) => {
    const cell = e.srcElement
    let x
    let y
    [x, y] = toggleSelected(cell)
    current[getCellCoordinates(cell).toString()] = new Point(x, y, cellIsSelected(cell))
})

function countOfSelectedSiblings(coordinates): number {
    const point = current[coordinates.toString()]
    return point.neighbors().filter(coordinates => {
        return current[coordinates.toString()] && current[coordinates.toString()].selected
    }).length
}

function die(coordinates): void {
    let x
    let y
    [x, y] = coordinates
    deselectCell(getCellFromCoordinates(x, y))
}

function beBorn(coordinates): void {
    let x
    let y
    [x, y] = coordinates
    selectCell(getCellFromCoordinates(x, y))
}

// This method looks through all eligible points and fills in whether or not they should be selected
function decideFate(pointsToCheck): void {
    console.log('deciding fate on ' + pointsToCheck.length + ' cells', 'cache length: ' + Object.keys(current).length)
    // ensure all are represented by a point in the hash

    pointsToCheck.forEach((coordinates) => {
        if (!current[coordinates.toString()]) {
            current[coordinates.toString()] = new Point(coordinates[0], coordinates[1], false)
        }
        const selectedSiblings = countOfSelectedSiblings(coordinates)
        if (current[coordinates.toString()].selected) {
            if (selectedSiblings < 2) {
                die(coordinates)
            }
            if (selectedSiblings > 3) {
                die(coordinates)
            }
        } else if (selectedSiblings === 3) {
            beBorn(coordinates)
        }
    })
    current = {}
}

runButton.addEventListener('click', () => {
    // allow run button to start and stop
    if (runner) {
        clearInterval(runner)
        runner = null
        return
    }

    runner = setInterval(() => {
        const currentlySelected = getSelected()
        let pointsToCheck = []
        // create an array of all the selected points and their neighbors
        currentlySelected.forEach(coordinates => {
            if (!current[coordinates.toString()]) {
                current[coordinates.toString()] = new Point(coordinates[0], coordinates[1], true)
            }
            pointsToCheck = pointsToCheck.concat(
                current[coordinates.toString()].neighbors().map((neighborCoordinates) => {
                    // looks like we cannot toString on such a large value...
                    // perhaps each cell should have a random number or divide the actual number by something to create a decimal
                    return neighborCoordinates
                })
            )
            pointsToCheck.push(coordinates)
        })
        decideFate(pointsToCheck)
    }, 1000)
})

createGrid(inputWrapper)

