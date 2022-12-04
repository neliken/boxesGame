const container = document.getElementById("container");
const buttonUndo = document.getElementById('undo');
const buttonRedo = document.getElementById('redo');
const buttonDeleteAll = document.getElementById('delete_all');
let boxPositions = [];
let deletedElements = [];

function drawSquare(point) {
    let newDiv = document.createElement("div");
    newDiv.classList.add('box');
    newDiv.style.left = point.x + "px";
    newDiv.style.top  = point.y + "px";
    container.appendChild(newDiv); 
}

function onMouseClick(callback) {
    container.addEventListener("click", (e) => {
        const { layerX: x, layerY: y } = e;

        if (callback) {
            callback({
                x: x,
                y: y
            });
        }
    });
}

// CALLBACK
// HOC
// ANONIMOUS FUNCTIONS

// entry point
onMouseClick(handlePoint);

function handlePoint(point) {
    // history.push(point);
// 1. put in the queue the new point
// 2. draw the new rect

    boxPositions.push(point);
    deletedElements = [];

    drawSquare(point);
    checkHistory();
}

function checkHistory() {
    if (drawSquare) {
        buttonUndo.disabled = false;
    }

    if (boxPositions.length === 0) {
        buttonUndo.disabled = true;
        buttonDeleteAll.disabled = true;
    }

    if(deletedElements.length === 0) {
        buttonRedo.disabled = true;
    }

    if( boxPositions.length !== 0 || deletedElements.length !== 0) {
        buttonDeleteAll.disabled = false;
    }

    buttonUndo.addEventListener('click', () => {
        buttonRedo.disabled = false;

        if (boxPositions.length === 0) {
            buttonUndo.disabled = true;
        }
    });

    buttonRedo.addEventListener('click', () => {
        buttonUndo.disabled = false;
 
        if(deletedElements.length === 0) {
            buttonRedo.disabled = true;
        }
    });

    buttonDeleteAll.addEventListener('click', () => {
        buttonUndo.disabled = buttonRedo.disabled = buttonDeleteAll.disabled = true;
    });
}

function undo(){ 
    deletedElements.push(boxPositions.pop());
    container.removeChild(container.lastElementChild);
}

function redo(){
    let lastChild = deletedElements.pop();

    boxPositions.push(lastChild)
    drawSquare(lastChild);
}

function deleteAll(){
    
    while (container.firstChild) {
        container.firstChild.remove()
    }

    boxPositions = [];
    deletedElements = [];
}

window.onbeforeunload = function() {
    localStorage.setItem("boxPositions",JSON.stringify(boxPositions)); //localStorage
    localStorage.setItem("deletedElements",JSON.stringify(deletedElements));
}

window.addEventListener("load", () => {
    console.log("page is fully loaded");
    const savedBoxPositions = localStorage.getItem("boxPositions");
    const deletedBoxPositions = localStorage.getItem("deletedElements");

    if (savedBoxPositions !== null ) {
    boxPositions = JSON.parse(savedBoxPositions);
    boxPositions.forEach(boxPosition => {
        drawSquare(boxPosition);
    })
    }

    if (deletedBoxPositions !== null ) {
        deletedElements = JSON.parse(deletedBoxPositions);
    }  

    checkHistory();
});