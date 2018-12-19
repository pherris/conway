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
  ROWS: 100,
  COLS: 100
}; // create the grid cells

exports.DOM = DOM;

function createGrid(inputWrapper) {
  if (!inputWrapper) return; // clean up just in case

  inputWrapper.childNodes.forEach(function (node) {
    return node.remove();
  });

  for (var y = 0; y < DOM.ROWS; y++) {
    var row = document.createElement('div');
    row.setAttribute('data-row', y.toString());
    inputWrapper.appendChild(row);

    for (var x = 0; x < DOM.COLS; x++) {
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
  return [parseInt(cell.getAttribute('data-x')), parseInt(cell.getAttribute('data-y'))];
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
  function Point(x, x_multiplier, y, y_multiplier, selected) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
    this.x_multiplier = x_multiplier;
    this.y_multiplier = y_multiplier;
    this.selected = selected; // cache some of the lookups

    this.topLeftKey = this.topLeftNeighbor().join(':');
    this.topKey = this.topNeighbor().join(':');
    this.topRightKey = this.topRightNeighbor().join(':');
    this.leftKey = this.leftNeighbor().join(':');
    this.rightKey = this.rightNeighbor().join(':');
    this.bottomLeftKey = this.bottomLeftNeighbor().join(':');
    this.bottomKey = this.bottomNeighbor().join(':');
    this.bottomRightKey = this.bottomRightNeighbor().join(':');
    this.key = [this.x, this.x_multiplier, this.y, this.y_multiplier].join(':');
  }

  _createClass(Point, [{
    key: "neighbors",
    // the helpers return [[x, x_multiplier], [y, y_multiplier]]
    value: function neighbors() {
      return [this.topLeftKey, this.topKey, this.topRightKey, this.leftKey, this.rightKey, this.bottomLeftKey, this.bottomKey, this.bottomRightKey];
    }
  }, {
    key: "bottomLeftNeighbor",
    value: function bottomLeftNeighbor() {
      return this.nextLowerCoordinate(this.x, this.x_multiplier).concat(this.nextHigherCoordinate(this.y, this.y_multiplier));
    }
  }, {
    key: "bottomNeighbor",
    value: function bottomNeighbor() {
      return [this.x, this.x_multiplier].concat(this.nextHigherCoordinate(this.y, this.y_multiplier));
    }
  }, {
    key: "bottomRightNeighbor",
    value: function bottomRightNeighbor() {
      return this.nextHigherCoordinate(this.x, this.x_multiplier).concat(this.nextHigherCoordinate(this.y, this.y_multiplier));
    }
  }, {
    key: "leftNeighbor",
    value: function leftNeighbor() {
      return this.nextLowerCoordinate(this.x, this.x_multiplier).concat([this.y, this.y_multiplier]);
    }
  }, {
    key: "rightNeighbor",
    value: function rightNeighbor() {
      return this.nextHigherCoordinate(this.x, this.x_multiplier).concat([this.y, this.y_multiplier]);
    }
  }, {
    key: "topLeftNeighbor",
    value: function topLeftNeighbor() {
      return this.nextLowerCoordinate(this.x, this.x_multiplier).concat(this.nextLowerCoordinate(this.y, this.y_multiplier));
    }
  }, {
    key: "topNeighbor",
    value: function topNeighbor() {
      return [this.x, this.x_multiplier].concat(this.nextLowerCoordinate(this.y, this.y_multiplier));
    }
  }, {
    key: "topRightNeighbor",
    value: function topRightNeighbor() {
      return this.nextHigherCoordinate(this.x, this.x_multiplier).concat(this.nextLowerCoordinate(this.y, this.y_multiplier));
    }
  }, {
    key: "nextHigherCoordinate",
    value: function nextHigherCoordinate(coord, multiplier) {
      if (coord == Point.MAX) {
        multiplier = multiplier + 1;
        coord = Point.MIN;
      } else {
        coord = coord + 1;
      }

      if (multiplier > Point.MAX_MULTIPLIER) {
        multiplier = 0;
      }

      return [coord, multiplier];
    }
  }, {
    key: "nextLowerCoordinate",
    value: function nextLowerCoordinate(coord, multiplier) {
      if (coord == Point.MIN) {
        multiplier = multiplier - 1;
        coord = Point.MAX;
      } else {
        coord = coord - 1;
      }

      if (multiplier <= 0) {
        multiplier = Point.MAX_MULTIPLIER;
      }

      return [coord, multiplier];
    }
  }, {
    key: "coordinates",
    get: function get() {
      return this.key;
    }
  }]);

  return Point;
}();

exports.default = Point;
Point.MIN = 0;
Point.MAX = Number.MAX_SAFE_INTEGER; // 0 counts

Point.MAX_MULTIPLIER = 2048; // there are 2048 of Number.MAX_SAFE_INTEGER in 2^64
},{}],"src/cached_points.ts":[function(require,module,exports) {
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

var CachedPoints =
/*#__PURE__*/
function () {
  function CachedPoints() {
    _classCallCheck(this, CachedPoints);

    this.cache = {};
  }

  _createClass(CachedPoints, [{
    key: "addOrUpdate",
    // add an item into the cache, has a side effect of hydrating siblings - could be more of a pure function
    value: function addOrUpdate(point) {
      var _this = this;

      if (!this.cache[point.coordinates]) {
        this.cache[point.coordinates] = point;
      }

      this.cache[point.coordinates].selected = point.selected;
      point.neighbors().forEach(function (neighborCoordinateKey) {
        var cachedPoint = _this.cache[neighborCoordinateKey];

        if (cachedPoint) {
          return;
        }

        var _neighborCoordinateKe = neighborCoordinateKey.split(':'),
            _neighborCoordinateKe2 = _slicedToArray(_neighborCoordinateKe, 4),
            x = _neighborCoordinateKe2[0],
            x_multiplier = _neighborCoordinateKe2[1],
            y = _neighborCoordinateKe2[2],
            y_multiplier = _neighborCoordinateKe2[3];

        _this.cache[neighborCoordinateKey] = new _point.default(parseInt(x), parseInt(x_multiplier), parseInt(y), parseInt(y_multiplier), false);
      });
    } // removes an item from the cache and adds to the removed list

  }, {
    key: "remove",
    value: function remove(point) {
      this.cache[point.coordinates].selected = false;

      if (!this.cache[point.coordinates]) {
        return false;
      }

      return true; // return delete this.cache[point.coordinates]
    } // find the siblings of this point and return the total number that are selected

  }, {
    key: "countOfSelectedSiblings",
    value: function countOfSelectedSiblings(point) {
      var _this2 = this;

      // for performance we're going to rely on this guy being in the cache for sure
      return point.neighbors().filter(function (neighborCoordinateKey) {
        var cachedPoint = _this2.cache[neighborCoordinateKey];
        return cachedPoint && cachedPoint.selected;
      }).length;
    }
  }, {
    key: "cached",
    get: function get() {
      return this.cache;
    }
  }, {
    key: "visibleItems",
    get: function get() {
      // TODO hold visible ones and return them
      return {};
    }
  }]);

  return CachedPoints;
}();

exports.default = CachedPoints;
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

var _cached_points = _interopRequireDefault(require("./cached_points"));

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var runButton = document.getElementById('run');
var frameContainer = document.getElementById('frame');
var inputWrapper = document.getElementById('input');
var initialState = document.getElementById('initial-state');
var currentState = document.getElementById('meta');
var runTime = document.getElementById('run-time');
var running = false;
var frameCount = 0;
var cachedPoints = new _cached_points.default();
var started = 0;

function addPoint(coordinates, selected) {
  var point = new _point.default(coordinates[0], 1, coordinates[1], 1, selected);
  cachedPoints.addOrUpdate(point);
} // This method determines if the UI contains any of the active points and displays them, it also serializes the cache into the textarea


function syncUi(addedPoints, removedPoints) {
  addedPoints.forEach(function (point) {
    var _point$coordinates$sp = point.coordinates.split(':'),
        _point$coordinates$sp2 = _slicedToArray(_point$coordinates$sp, 4),
        x = _point$coordinates$sp2[0],
        x_multiplier = _point$coordinates$sp2[1],
        y = _point$coordinates$sp2[2],
        y_multiplier = _point$coordinates$sp2[3];

    if (point.selected && parseInt(x) < _dom_helpers.DOM.COLS && parseInt(y) < _dom_helpers.DOM.ROWS) {
      var cell = (0, _dom_helpers.getCellFromCoordinates)(x.toString(), y.toString());
      (0, _dom_helpers.selectCell)(cell);
    }
  });
  removedPoints.forEach(function (point) {
    var _point$coordinates$sp3 = point.coordinates.split(':'),
        _point$coordinates$sp4 = _slicedToArray(_point$coordinates$sp3, 4),
        x = _point$coordinates$sp4[0],
        x_multiplier = _point$coordinates$sp4[1],
        y = _point$coordinates$sp4[2],
        y_multiplier = _point$coordinates$sp4[3];

    if (parseInt(x) < _dom_helpers.DOM.COLS && parseInt(y) < _dom_helpers.DOM.ROWS) {
      var cell = (0, _dom_helpers.getCellFromCoordinates)(x.toString(), y.toString());
      (0, _dom_helpers.deselectCell)(cell);
    }
  });
  frameContainer.innerText = (frameCount++).toString();
  runTime.innerText = (Date.now() - started).toString(); // let the user see how long things took after every 500 frames

  if (frameCount % 500 === 0) {
    toggle();
  }
}

function perform() {
  // console.log(`Cache contains ${cachedPoints.cached.length} items`)
  if (started === 0) {
    return;
  }

  var added = [];
  var removed = [];
  var surviving = [];
  Object.values(cachedPoints.cached).forEach(function (point) {
    var selectedSiblings = cachedPoints.countOfSelectedSiblings(point);

    if (point.selected && (selectedSiblings < 2 || selectedSiblings > 3)) {
      removed.push(point);
    } // be born!


    if (!point.selected && selectedSiblings === 3) {
      added.push(point);
    } // survive


    if (point.selected && (selectedSiblings == 2 || selectedSiblings == 3)) {
      surviving.push(point);
    }
  });
  removed.forEach(function (point) {
    return cachedPoints.remove(point);
  });
  added.concat(surviving).forEach(function (point) {
    return (point.selected = true) && cachedPoints.addOrUpdate(point);
  });
  syncUi(added, removed);
  setTimeout(perform, 0);
}

function toggle() {
  // allow run button to start and stop
  if (started > 0) {
    runButton.innerText = 'Restart';
    started = 0;
    var selectedPoints = Object.values(cachedPoints.cached).filter(function (point) {
      return point.selected;
    }).reduce(function (accumulator, point) {
      var _point$coordinates$sp5 = point.coordinates.split(':'),
          _point$coordinates$sp6 = _slicedToArray(_point$coordinates$sp5, 4),
          x = _point$coordinates$sp6[0],
          x_multiplier = _point$coordinates$sp6[1],
          y = _point$coordinates$sp6[2],
          y_multiplier = _point$coordinates$sp6[3];

      accumulator.push([x, y]);
      return accumulator;
    }, []);
    started = 0;
    runTime.innerText = "".concat(runTime.innerText, "ms. ").concat(Object.keys(cachedPoints.cached).length, " items in cache");
    currentState.querySelector('pre').innerText = JSON.stringify(selectedPoints, null, 2);
    return;
  }

  started = Date.now();
  runButton.innerText = 'Stop';
  setTimeout(perform, 0);
} // Add the ability to click cells to toggle them on and off


inputWrapper && inputWrapper.addEventListener('click', function (e) {
  var cell = e.srcElement;
  addPoint((0, _dom_helpers.toggleSelected)(cell), (0, _dom_helpers.cellIsSelected)(cell));
});
runButton && runButton.addEventListener('click', toggle);
initialState && initialState.addEventListener('change', function () {
  var newState = JSON.parse(initialState.value);
  newState.forEach(function (coordinates) {
    var cell = (0, _dom_helpers.getCellFromCoordinates)(coordinates[0], coordinates[1]);
    if (!cell) return;
    cell.click();
  });
});
(0, _dom_helpers.createGrid)(inputWrapper);
},{"./dom_helpers":"src/dom_helpers.ts","./point":"src/point.ts","./cached_points":"src/cached_points.ts","./style.scss":"src/style.scss"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63404" + '/');

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