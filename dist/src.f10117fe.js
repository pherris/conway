// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/dom_helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGrid = createGrid;
exports.toggleSelected = toggleSelected;
exports.deselectCell = deselectCell;
exports.selectCell = selectCell;
exports.getSelected = getSelected;
exports.cellIsSelected = cellIsSelected;
exports.getCellCoordinates = getCellCoordinates;
exports.getCellFromCoordinates = getCellFromCoordinates;

// create the grid cells
function createGrid(inputWrapper) {
  // clean up just in case
  inputWrapper.childNodes.forEach(function (node) {
    return node.remove();
  });

  for (var y = 0; y < 100; y++) {
    var row = document.createElement('div');
    row.setAttribute('data-row', y.toString());
    inputWrapper.appendChild(row);

    for (var x = 0; x < 100; x++) {
      var clickableElement = document.createElement('div');
      clickableElement.classList.add('cell');
      clickableElement.setAttribute('data-x', x.toString());
      clickableElement.setAttribute('data-y', y.toString());
      clickableElement.setAttribute('data-selected', 'false');
      row.appendChild(clickableElement);
    }
  }
}

function toggleSelected(cell) {
  if (cellIsSelected(cell)) {
    deselectCell(cell);
  } else {
    selectCell(cell);
  }

  return getCellCoordinates(cell);
}

function deselectCell(cell) {
  cell.classList.remove('selected');
}

function selectCell(cell) {
  cell.classList.add('selected');
} // inspects the DOM for currently selected cells


function getSelected() {
  var coordinates = [];
  document.querySelectorAll('#input .cell.selected').forEach(function (selectedCell) {
    coordinates.push(getCellCoordinates(selectedCell));
  });
  return coordinates;
}

function cellIsSelected(cell) {
  return cell.classList.contains('selected');
}

function getCellCoordinates(cell) {
  return [BigInt(cell.getAttribute('data-x')), BigInt(cell.getAttribute('data-y'))];
}

function getCellFromCoordinates(x, y) {
  return document.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
}
},{}],"src/point.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Point = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// represents a point in the grid which is aware of the coordinates of each of its neighbors
var Point =
/*#__PURE__*/
function () {
  function Point(x, y, selected) {
    _classCallCheck(this, Point);

    this.MIN = BigInt(0);
    this.MAX = BigInt(1.8446744e+19);
    this.x = x;
    this.y = y;
    this.selected = selected;
  }

  _createClass(Point, [{
    key: "neighbors",
    value: function neighbors() {
      return [this.topLeftNeighbor(), this.topNeighbor(), this.topRightNeighbor(), this.leftNeighbor(), this.rightNeighbor(), this.bottomLeftNeighbor(), this.bottomNeighbor(), this.bottomRightNeighbor()];
    }
  }, {
    key: "topLeftNeighbor",
    value: function topLeftNeighbor() {
      return [this.nextLowerCoordinate(this.x), this.nextHigherCoordinate(this.y)];
    }
  }, {
    key: "topNeighbor",
    value: function topNeighbor() {
      return [this.x, this.nextHigherCoordinate(this.y)];
    }
  }, {
    key: "topRightNeighbor",
    value: function topRightNeighbor() {
      return [this.nextHigherCoordinate(this.x), this.nextHigherCoordinate(this.y)];
    }
  }, {
    key: "leftNeighbor",
    value: function leftNeighbor() {
      return [this.nextLowerCoordinate(this.x), this.y];
    }
  }, {
    key: "rightNeighbor",
    value: function rightNeighbor() {
      return [this.nextHigherCoordinate(this.x), this.y];
    }
  }, {
    key: "bottomLeftNeighbor",
    value: function bottomLeftNeighbor() {
      return [this.nextLowerCoordinate(this.x), this.nextLowerCoordinate(this.y)];
    }
  }, {
    key: "bottomNeighbor",
    value: function bottomNeighbor() {
      return [this.x, this.nextLowerCoordinate(this.y)];
    }
  }, {
    key: "bottomRightNeighbor",
    value: function bottomRightNeighbor() {
      return [this.nextHigherCoordinate(this.x), this.nextLowerCoordinate(this.y)];
    }
  }, {
    key: "nextHigherCoordinate",
    value: function nextHigherCoordinate(coord) {
      return coord == this.MAX ? this.MIN : coord + BigInt(1);
    }
  }, {
    key: "nextLowerCoordinate",
    value: function nextLowerCoordinate(coord) {
      return coord == this.MIN ? this.MAX : coord - BigInt(1);
    }
  }]);

  return Point;
}();

exports.Point = Point;
},{}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.ts":[function(require,module,exports) {
"use strict";

var _dom_helpers = require("./dom_helpers");

var _point = require("./point");

require("./style.scss");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// TODO, the grid is not quite centered
// TODO, this approach isn't working due to the limit in the js number and tos
var runButton = document.getElementById('run');
var frameContainer = document.getElementById('frame');
var inputWrapper = document.getElementById('input');
var runner; // holds the selected cells - coordinates are keys, selected is the new point

var current = {};
inputWrapper.addEventListener('click', function (e) {
  var cell = e.srcElement;
  var x;
  var y;

  var _toggleSelected = (0, _dom_helpers.toggleSelected)(cell);

  var _toggleSelected2 = _slicedToArray(_toggleSelected, 2);

  x = _toggleSelected2[0];
  y = _toggleSelected2[1];
  current[(0, _dom_helpers.getCellCoordinates)(cell).toString()] = new _point.Point(x, y, (0, _dom_helpers.cellIsSelected)(cell));
});

function countOfSelectedSiblings(coordinates) {
  var point = current[coordinates.toString()];
  return point.neighbors().filter(function (coordinates) {
    return current[coordinates.toString()] && current[coordinates.toString()].selected;
  }).length;
}

function die(coordinates) {
  var x;
  var y;

  var _coordinates = _slicedToArray(coordinates, 2);

  x = _coordinates[0];
  y = _coordinates[1];
  (0, _dom_helpers.deselectCell)((0, _dom_helpers.getCellFromCoordinates)(x, y));
}

function beBorn(coordinates) {
  var x;
  var y;

  var _coordinates2 = _slicedToArray(coordinates, 2);

  x = _coordinates2[0];
  y = _coordinates2[1];
  (0, _dom_helpers.selectCell)((0, _dom_helpers.getCellFromCoordinates)(x, y));
} // This method looks through all eligible points and fills in whether or not they should be selected


function decideFate(pointsToCheck) {
  console.log('deciding fate on ' + pointsToCheck.length + ' cells', 'cache length: ' + Object.keys(current).length); // ensure all are represented by a point in the hash

  pointsToCheck.forEach(function (coordinates) {
    if (!current[coordinates.toString()]) {
      current[coordinates.toString()] = new _point.Point(coordinates[0], coordinates[1], false);
    }

    var selectedSiblings = countOfSelectedSiblings(coordinates);

    if (current[coordinates.toString()].selected) {
      if (selectedSiblings < 2) {
        die(coordinates);
      }

      if (selectedSiblings > 3) {
        die(coordinates);
      }
    } else if (selectedSiblings === 3) {
      beBorn(coordinates);
    }
  });
  current = {};
}

runButton.addEventListener('click', function () {
  // allow run button to start and stop
  if (runner) {
    clearInterval(runner);
    runner = null;
    return;
  }

  runner = setInterval(function () {
    var currentlySelected = (0, _dom_helpers.getSelected)();
    var pointsToCheck = []; // create an array of all the selected points and their neighbors

    currentlySelected.forEach(function (coordinates) {
      if (!current[coordinates.toString()]) {
        current[coordinates.toString()] = new _point.Point(coordinates[0], coordinates[1], true);
      }

      pointsToCheck = pointsToCheck.concat(current[coordinates.toString()].neighbors().map(function (neighborCoordinates) {
        // looks like we cannot toString on such a large value...
        // perhaps each cell should have a random number or divide the actual number by something to create a decimal
        return neighborCoordinates;
      }));
      pointsToCheck.push(coordinates);
    });
    decideFate(pointsToCheck);
  }, 1000);
});
(0, _dom_helpers.createGrid)(inputWrapper);
},{"./dom_helpers":"src/dom_helpers.ts","./point":"src/point.ts","./style.scss":"src/style.scss"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52060" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.map