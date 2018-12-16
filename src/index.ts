// index.ts
import message from './message'
import './style.scss'

console.log(message)

const inputWrapper = document.getElementById('input');

// clean up just in case
inputWrapper.childNodes.forEach((node) => node.remove())

for (let y = 0; y < 100; y++) {
    const row = document.createElement('div')
    row.setAttribute('data-row', y.toString())
    inputWrapper.appendChild(row)
    for (let x = 0; x < 100; x++) {
        const clickableElement = document.createElement('div')
        clickableElement.classList.add('cell')
        clickableElement.setAttribute('data-x', x.toString());
        clickableElement.setAttribute('data-y', y.toString())
        clickableElement.setAttribute('data-selected', 'false');
        row.appendChild(clickableElement)
    }
}
