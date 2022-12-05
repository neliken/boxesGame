const container = HtmlNode("#container");
const buttonUndo = HtmlNode("#undo");
const buttonRedo = HtmlNode("#redo");
const buttonDeleteAll = HtmlNode("#deleteAll");
const containerElement = container.el();

let boxPositions = Position();
let deletedElements = Position();

function drawSquare(point) {
  let newDiv = document.createElement("div");
  newDiv.classList.add("box");
  newDiv.style.left = point.x + "px";
  newDiv.style.top = point.y + "px";
  containerElement.appendChild(newDiv);
}

function onMouseClick(callback) {
  containerElement.addEventListener("click", (e) => {
    const { layerX: x, layerY: y } = e;

    if (callback) {
      callback({
        x: x,
        y: y,
      });
    }
  });
}

onMouseClick(handlePoint);

function handlePoint(point) {
  boxPositions.save(point);
  deletedElements.removeAll();

  drawSquare(point);
  checkHistory();
}

function Position() {
  let elements = [];

  return {
    get: function () {
      return elements;
    },
    length: function() {
      return elements.length;
    },
    save: function (point) {
      elements.push(point);
    },
    removeLast: function () {
      return elements.pop();
    },
    removeAll: function () {
      elements = [];
      return elements;
    },
  };
}

function checkHistory() {
  if (drawSquare) {
    buttonUndo.enable();
  }

  buttonUndo.toggle(boxPositions.length());
  buttonRedo.toggle(deletedElements.length());
  buttonDeleteAll.toggle(boxPositions.length());
  buttonDeleteAll.toggle(
    boxPositions.length() !== 0 || deletedElements.length() !== 0
  );

  eventsListenerHandler();
}

function HtmlNode(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    console.error("This element does not exists");
    return;
  }

  return {
    el: function () {
      return element;
    },
    enable: function () {
      element.disabled = false;
    },
    disable: function () {
      element.disabled = true;
    },
    toggle: function (condition) {
      element.disabled = !Boolean(condition);
    },
    removeLast: function() {
      return element.removeChild(element.lastElementChild);
    }
  };
}

function undo() {
  deletedElements.save(boxPositions.removeLast());
  container.removeLast();
}

function redo() {
  let lastChild = deletedElements.removeLast();

  boxPositions.save(lastChild);
  drawSquare(lastChild);
}

function deleteAll() {
  while (containerElement.firstChild) {
    containerElement.firstChild.remove();
  }

  boxPositions.removeAll();
  deletedElements.removeAll();
}

window.onbeforeunload = function () {
  localStorage.setItem("boxPositions", JSON.stringify(boxPositions.get())); //localStorage
  localStorage.setItem("deletedElements", JSON.stringify(deletedElements.get()));
};

window.addEventListener("load", () => {
  const savedBoxPositions = localStorage.getItem("boxPositions");
  const deletedBoxPositions = localStorage.getItem("deletedElements");

  if (savedBoxPositions !== null) {
    const positions = JSON.parse(savedBoxPositions);

    positions.forEach((point) => {
      boxPositions.save(point);
      drawSquare(point);
    });
  }

  if (deletedBoxPositions !== null) {
    const deletedPositions = JSON.parse(deletedBoxPositions);

    deletedPositions.forEach((point) => {
      deletedElements.save(point);
    });
  }

  checkHistory();
});

function eventsListenerHandler() {
  buttonUndo.el().addEventListener("click", () => {
    buttonRedo.enable();
    buttonUndo.toggle(boxPositions.length());
  });

  buttonRedo.el().addEventListener("click", () => {
    buttonUndo.enable();
    buttonRedo.toggle(deletedElements.length());
  });

  buttonDeleteAll.el().addEventListener("click", () => {
    buttonUndo.disable();
    buttonRedo.disable();
    buttonDeleteAll.disable();
  });
}
