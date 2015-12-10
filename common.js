(function(window) {

  // set the width and height of an DOM Element
  var setSize = function(stage, w, h) {
    stage.setAttribute('width', w);
    stage.setAttribute('height', h);
  }

  // Create a named SVG element on a node, with attributes and optional text
  var appendTo = function(node,name,attrs,text){
    var p,ns=appendTo.ns,svg=node,doc=node.ownerDocument;
    if (!ns){ // cache namespaces by prefix once
      while (svg&&svg.tagName!='svg') svg=svg.parentNode;
      ns=appendTo.ns={svg:svg.namespaceURI};
      for (var a=svg.attributes,i=a.length;i--;){
        if (a[i].namespaceURI) ns[a[i].localName]=a[i].nodeValue;
      }
    }
    var el = doc.createElementNS(ns.svg,name);
    for (var attr in attrs){
      if (!attrs.hasOwnProperty(attr)) continue;
      if (!(p=attr.split(':'))[1]) el.setAttribute(attr,attrs[attr]);
      else el.setAttributeNS(ns[p[0]]||null,p[1],attrs[attr]);
    }
    if (text) el.appendChild(doc.createTextNode(text));
    return node.appendChild(el);
  }

  // remove all child element of a DOM Node
  var clear = function(node){
    while (node.lastChild) node.removeChild(node.lastChild);
  }

  // clamp the value v between min and max
  var clamp = function(v, min, max) {
    return Math.min(Math.max(min, v), max);
  };

  var setupMouseHandler = function(target, pos, dragHandler, zoom, doubleClick) {
    var dragState = {
      position: {
        x: 0,
        y: 0,
      }
    };

    var mouseOffset = {x:0,y:0};
    var moveListener = function(evtMove) {
      evtMove.preventDefault();
      var cursor = pos(evtMove);
      dragHandler.move(evtMove, cursor, dragState.mode);
      var cursorNew = pos(evtMove);
      mouseOffset.x = cursorNew.x;
      mouseOffset.y = cursorNew.y;
    };

    var releaseListener = function(evtUp) {
      evtUp.preventDefault();

      var mode = dragState.mode;
      var cursor = pos(evtUp);

      dragState.mode = null;

      mouseOffset.x = 0;
      mouseOffset.y = 0;

      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', releaseListener);

      dragHandler.end(evtUp, cursor, mode);
    };

    target.addEventListener('mousedown', function(evtDown) {
      evtDown.preventDefault();

      var cursor = pos(evtDown);
      var dragMode = (dragHandler.start(evtDown, cursor)) || null;
      if(dragMode !== null) {
        dragState.mode = dragMode;

        mouseOffset.x = cursor.x;
        mouseOffset.y = cursor.y;

        document.addEventListener('mouseup', releaseListener);
        document.addEventListener('mousemove', moveListener);

        dragHandler.move(evtDown, cursor, dragState.mode);
      }
    });

    target.addEventListener('wheel', function(zoomEvt) {
      zoomEvt.preventDefault();

      var cursorNew = pos(zoomEvt);
      var wheel = zoomEvt.deltaY / -40;
      var factor = Math.pow(1 + Math.abs(wheel)/2 , wheel > 0 ? 1 : -1);

      zoom(factor, cursorNew);
    });

    target.addEventListener('dblclick', function(dblClickEvt) {
      dblClickEvt.preventDefault();
      var cursor = pos(dblClickEvt);

      doubleClick && doubleClick(dblClickEvt, cursor);
    });

    return dragState;
  };

  var createDragHandler = function(render, pan) {
    return {
      start: function(evt, pos) {
        return {
          type: 'pan',
          initialPos: {
            x: pos.x,
            y: pos.y,
          },
        };
      },
      move: function(evt, pos, mode) {
        if(mode.type === 'pan') {
          if(mode.initialPos.x === pos.x
          && mode.initialPos.y === pos.y) {
            return;
          }
          pan && pan(pos.x - mode.initialPos.x, pos.y - mode.initialPos.y);
        }
        render();
      },
      end: function(evt, pos, mode) {

      },
    };
  };

  // cam: object which x and y properties should be set
  // render: render function to be called when data changes
  var createPanHandler = function(cam, render, clamp) {
    return function(dx, dy) {
      var clamped = clamp(cam.x - dx, cam.y - dy);
      cam.x = clamped.x;
      cam.y = clamped.y;
      render();
    };
  };

  var createDynamicClamper = function(minWidth, minHeight) {
    return function(x,y) {
      return {
        x: clamp(x, -minWidth, minWidth),
        y: clamp(y, -minHeight, minHeight),
      };
    }
  }

  var createCamera = function() {
    return {x:0,y:0,zoom:1};
  };

  var createZoomHandler = function(cam, render, min, max, panHandler) {
    return function(factor, pos) {
      var oldZoom = cam.zoom;
      var newZoom = clamp(cam.zoom*factor, min, max);

      var moveFactor = 1 - (oldZoom / newZoom);

      cam.zoom = newZoom;
      if (panHandler) {
        panHandler(-(pos.x - cam.x) * moveFactor, -(pos.y - cam.y) * moveFactor);
      } else {
        render();
      }
    };
  };

  var requestFrame = (window.requestAnimationFrame || function(cb) {
    this.setTimeout(cb, 16);
  }).bind(window);

  var throttle = (function() {
    var id = null;
    var frame = function(func) {
      id = null;
      func();
    }
    return function(func) {
      if(id !== null) {
        return;
      }
      id = requestFrame(frame.bind(null, func));
    };
  })();

  var makeRenderer = function(renderFunction, sync) {
    return sync ? renderFunction :
      throttle.bind(null, renderFunction);
  };

  window.createDynamicClamper = createDynamicClamper;
  window.makeRenderer = makeRenderer;
  window.createZoomHandler = createZoomHandler;
  window.createCamera = createCamera;
  window.createPanHandler = createPanHandler;
  window.createDragHandler = createDragHandler;
  window.setupMouseHandler = setupMouseHandler;
  window.clamp = clamp;
  window.setStageSize = setSize;
  window.appendToSVG = appendTo;
  window.clearSVG = clear;
})(window);
