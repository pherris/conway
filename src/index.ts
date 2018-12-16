// index.ts
import message from './message'
import { createGrid, DOM, toggleSelected, cellIsSelected, getCellCoordinates, getCellFromCoordinates, deselectCell, selectCell } from './dom_helpers'
import Point from './point'
import ActivePoints from './active_points'
import './style.scss'

const runButton = document.getElementById('run')
const frameContainer = document.getElementById('frame')
const inputWrapper = document.getElementById('input')
const currentState = <HTMLInputElement>document.getElementById('current-state')
let runner: number;
const activePoints = new ActivePoints()

function addPoint(coordinates: bigint[], selected: boolean): void {
    const existingCachedItem = activePoints.find(coordinates)

    let point: Point

    if (existingCachedItem) {
        existingCachedItem.selected = !existingCachedItem.selected
        point = existingCachedItem
    } else {
        point = new Point(coordinates[0], coordinates[1], selected)
    }

    activePoints.addOrUpdate(point)
}

// This method determines if the UI contains any of the active points and displays them, it also serializes the cache into the textarea
function syncUi(visibleAddedPoints: bigint[][], visibleRemovedPoints: bigint[][]): void {
    visibleAddedPoints.forEach(coordinates => {
        const cell = getCellFromCoordinates(coordinates[0].toString(), coordinates[1].toString())
        selectCell(cell)
    })

    visibleRemovedPoints.forEach(coordinates => {
        const cell = getCellFromCoordinates(coordinates[0].toString(), coordinates[1].toString())
        deselectCell(cell)
    })

    const selectedPoints = activePoints.cached
        .filter(coordinates => activePoints.find(coordinates).selected)
        .reduce((accumulator: string[][], coordinates) => {
            accumulator.push([coordinates[0].toString(), coordinates[1].toString()])
            return accumulator
        }, [])

    currentState.value = JSON.stringify(selectedPoints, null, 2)
}

function perform() {
    console.log(`Cache contains ${activePoints.cached.length} items`)
    const added = []
    const removed = []
    activePoints.cached.forEach(coordinate => {
        const point = activePoints.find(coordinate)
        const selectedSiblings: number = activePoints.countOfSelectedSiblings(point)

        console.log(point, selectedSiblings)
        if (selectedSiblings < 2 || selectedSiblings > 3) {
            // activePoints.remove(point)
            removed.push(point)
        }

        if (selectedSiblings === 3) {
            // point.selected = true
            added.push(point)
        }
    })

    syncUi(
        activePoints.cached.filter(coordinates => {
            let x = coordinates[0]
            let y = coordinates[1]
            return x < DOM.COLS && y < DOM.ROWS
        }),

        activePoints.removedItems.filter(coordinates => {
            let x = coordinates[0]
            let y = coordinates[1]
            return x < DOM.COLS && y < DOM.ROWS
        })
    )

    // update the cache
    added.forEach(point => point.selected = true)
    removed.forEach(point => activePoints.remove(point))
    activePoints.cleanRemoved()
}

// Add the ability to click cells to toggle them on and off
inputWrapper.addEventListener('click', (e) => {
    const cell = e.srcElement
    addPoint(toggleSelected(cell), cellIsSelected(cell))
})

runButton.addEventListener('click', () => {
    // allow run button to start and stop
    if (runner) {
        clearInterval(runner)
        runner = null
        return
    }

    runner = setInterval(perform, 30 * 1000)
    setTimeout(perform, 0)
})

createGrid(inputWrapper)
