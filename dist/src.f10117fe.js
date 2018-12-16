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
exports.DOM = void 0;
var DOM = {
  ROWS: BigInt(100),
  COLS: BigInt(100)
}; // create the grid cells

exports.DOM = DOM;

function createGrid(inputWrapper) {
  // clean up just in case
  inputWrapper.childNodes.forEach(function (node) {
    return node.remove();
  });

  for (var y = BigInt(0); y < DOM.ROWS; y++) {
    var row = document.createElement('div');
    row.setAttribute('data-row', y.toString());
    inputWrapper.appendChild(row);

    for (var x = BigInt(0); x < DOM.COLS; x++) {
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
exports.default = void 0;

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
  }, {
    key: "coordinates",
    get: function get() {
      return [this.x, this.y];
    }
  }]);

  return Point;
}();

exports.default = Point;
},{}],"src/active_points.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ActivePoints =
/*#__PURE__*/
function () {
  function ActivePoints() {
    _classCallCheck(this, ActivePoints);

    // We're going to use an array to hold the active points and use the slower `find` approach to pull back each item we
    // are interested in.  The preference would be to use a hash where the key was an array of the `x` and `y` coordinates
    // which would make lookup very snappy, however I found I cannot use an object as they key in Typescript and I cannot 
    // serialize the larger numbers without losing percision. 
    // If speed is important or this approach proves itself to be too slow, I would move this structure onto a language 
    // where the map approach was possible - probably shouldve picked Ruby...
    this.cache = [];
    this._removed = [];
  }

  _createClass(ActivePoints, [{
    key: "cleanRemoved",
    value: function cleanRemoved() {
      this._removed = [];
    } // add an item into the cache, has a side effect of hydrating siblings - could be more of a pure function

  }, {
    key: "addOrUpdate",
    value: function addOrUpdate(point) {
      var _this = this;

      if (!this.find(point.coordinates)) {
        this.cache.push(point);
      }

      point.neighbors().forEach(function (neighboringCoordinates) {
        // if our neighbor already exists, we've nothing to do
        if (_this.find(neighboringCoordinates)) {
          return;
        }

        _this.cache.push(new _point.default(neighboringCoordinates[0], neighboringCoordinates[1], false));
      });
    } // safely removes an item from the cache returning `true` if it succeeds and `false` if it does not

  }, {
    key: "remove",
    value: function remove(point) {
      var indexToRemove = this.findIndexInCache(point.coordinates);

      if (indexToRemove == -1) {
        return false;
      }

      this._removed.push(this.cache.splice(indexToRemove, 1)[0]);

      return true;
    } // get the cached item if it exists

  }, {
    key: "find",
    value: function find(coordinates) {
      var index = this.findIndexInCache(coordinates);
      if (index == -1) return null;
      return this.cache[index];
    } // find the siblings of this point and return the total number that are selected

  }, {
    key: "countOfSelectedSiblings",
    value: function countOfSelectedSiblings(point) {
      var _this2 = this;

      var cachedPoint = this.cache[this.findIndexInCache(point.coordinates)];
      return cachedPoint.neighbors().filter(function (coordinates) {
        var neighboringIndex = _this2.findIndexInCache(coordinates);

        return neighboringIndex > -1 && _this2.cache[neighboringIndex].selected;
      }).length;
    } // returns the index of the object you seek

  }, {
    key: "findIndexInCache",
    value: function findIndexInCache(coordinates) {
      var x;
      var y;

      var _coordinates = _slicedToArray(coordinates, 2);

      x = _coordinates[0];
      y = _coordinates[1];
      return this.cache.findIndex(function (point) {
        return point.coordinates[0] == x && point.coordinates[1] == y;
      });
    }
  }, {
    key: "cached",
    get: function get() {
      return this.cache.map(function (point) {
        return point.coordinates;
      });
    }
  }, {
    key: "removedItems",
    get: function get() {
      return this._removed.map(function (point) {
        return point.coordinates;
      });
    }
  }]);

  return ActivePoints;
}();

exports.default = ActivePoints;
},{"./point":"src/point.ts"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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

var _point = _interopRequireDefault(require("./point"));

var _active_points = _interopRequireDefault(require("./active_points"));

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runButton = document.getElementById('run');
var frameContainer = document.getElementById('frame');
var inputWrapper = document.getElementById('input');
var initialState = document.getElementById('initial-state');
var currentState = document.getElementById('meta');
var running = false;
var frameCount = 0;
var activePoints = new _active_points.default();

function addPoint(coordinates, selected) {
  var existingCachedItem = activePoints.find(coordinates);
  var point;

  if (existingCachedItem) {
    existingCachedItem.selected = !existingCachedItem.selected;
    point = existingCachedItem;
  } else {
    point = new _point.default(coordinates[0], coordinates[1], selected);
  }

  activePoints.addOrUpdate(point);
} // This method determines if the UI contains any of the active points and displays them, it also serializes the cache into the textarea


function syncUi(visibleAddedPoints, visibleRemovedPoints) {
  visibleAddedPoints.forEach(function (point) {
    var cell = (0, _dom_helpers.getCellFromCoordinates)(point.coordinates[0].toString(), point.coordinates[1].toString());
    (0, _dom_helpers.selectCell)(cell);
  });
  visibleRemovedPoints.forEach(function (point) {
    var cell = (0, _dom_helpers.getCellFromCoordinates)(point.coordinates[0].toString(), point.coordinates[1].toString());
    (0, _dom_helpers.deselectCell)(cell);
  });
  var selectedPoints = activePoints.cached.filter(function (coordinates) {
    return activePoints.find(coordinates).selected;
  }).reduce(function (accumulator, coordinates) {
    accumulator.push([coordinates[0].toString(), coordinates[1].toString()]);
    return accumulator;
  }, []);
  currentState.querySelector('pre').innerText = JSON.stringify(selectedPoints, null, 2);
  frameContainer.innerText = (frameCount++).toString();
}

function perform() {
  console.log("Cache contains ".concat(activePoints.cached.length, " items"));
  if (!running) return;
  var added = [];
  var removed = [];
  var surviving = [];
  activePoints.cached.forEach(function (coordinate) {
    var point = activePoints.find(coordinate);
    var selectedSiblings = activePoints.countOfSelectedSiblings(point);

    if (point.selected && (selectedSiblings < 2 || selectedSiblings > 3)) {
      removed.push(point);
    } // be born!


    if (!point.selected && selectedSiblings === 3) {
      added.push(point);
    } // survive


    if (point.selected && (selectedSiblings == 2 || selectedSiblings == 3)) {
      surviving.push(point);
    }
  }); // update the cache

  removed.forEach(function (point) {
    return activePoints.remove(point);
  });
  added.concat(surviving).forEach(function (point) {
    return (point.selected = true) && activePoints.addOrUpdate(point);
  });
  activePoints.cleanRemoved();
  syncUi(added.filter(function (point) {
    var x = point.coordinates[0];
    var y = point.coordinates[1];
    return point.selected && x < _dom_helpers.DOM.COLS && y < _dom_helpers.DOM.ROWS;
  }), removed.filter(function (point) {
    var x = point.coordinates[0];
    var y = point.coordinates[1];
    return x < _dom_helpers.DOM.COLS && y < _dom_helpers.DOM.ROWS;
  }));
  setTimeout(perform, 0);
} // Add the ability to click cells to toggle them on and off


inputWrapper.addEventListener('click', function (e) {
  var cell = e.srcElement;
  addPoint((0, _dom_helpers.toggleSelected)(cell), (0, _dom_helpers.cellIsSelected)(cell));
});
runButton.addEventListener('click', function () {
  // allow run button to start and stop
  if (running) {
    runButton.innerText = 'Restart';
    running = false;
    return;
  }

  running = true;
  runButton.innerText = 'Stop';
  setTimeout(perform, 0);
});
initialState.addEventListener('change', function () {
  var newState = JSON.parse(initialState.value);
  newState.forEach(function (coordinates) {
    var cell = (0, _dom_helpers.getCellFromCoordinates)(coordinates[0], coordinates[1]);
    cell.click();
  });
});
(0, _dom_helpers.createGrid)(inputWrapper);
},{"./dom_helpers":"src/dom_helpers.ts","./point":"src/point.ts","./active_points":"src/active_points.ts","./style.scss":"src/style.scss"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56486" + '/');

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