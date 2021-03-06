export const DOM = {
    ROWS: 100,
    COLS: 100
}

// create the grid cells
export function createGrid(inputWrapper): void {
    if (!inputWrapper) return

    // clean up just in case
    inputWrapper.childNodes.forEach((node) => node.remove())

    for (let y = 0; y < DOM.ROWS; y++) {
        const row = document.createElement('div')
        row.setAttribute('data-row', y.toString())
        inputWrapper.appendChild(row)
        for (let x = 0; x < DOM.COLS; x++) {
            const clickableElement = document.createElement('div')
            clickableElement.classList.add('cell')
            clickableElement.setAttribute('data-x', x.toString());
            clickableElement.setAttribute('data-y', y.toString())
            clickableElement.setAttribute('data-selected', 'false');
            row.appendChild(clickableElement)
        }
    }

}

export function toggleSelected(cell): number[] {
    if (cellIsSelected(cell)) {
        deselectCell(cell)
    } else {
        selectCell(cell)
    }
    return getCellCoordinates(cell)
}

export function deselectCell(cell) {
    cell.classList.remove('selected')
}

export function selectCell(cell) {
    cell.classList.add('selected')
}

// inspects the DOM for currently selected cells
export function getSelected(): bigint[][] {
    const coordinates = []
    document.querySelectorAll('#input .cell.selected').forEach(selectedCell => {
        coordinates.push(getCellCoordinates(selectedCell))
    })
    return coordinates
}

export function cellIsSelected(cell): boolean {
    return cell.classList.contains('selected')
}

export function getCellCoordinates(cell): number[] {
    return [parseInt(cell.getAttribute('data-x')), parseInt(cell.getAttribute('data-y'))]
}

export function getCellFromCoordinates(x: string, y: string) {
    return document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
}
