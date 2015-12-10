(function() {

  var negation = function(target) {
    return appendToSVG(target,'circle',{
      cx: 35,
      cy: 0,
      r: 10
    });
  };

  var exclusion = function(target) {
    return appendToSVG(target,'path',{
      d: `M-50,35c0,0 17.5,-3 17.5,-35c0,-32.5 -18,-35 -18,-35`,
      stroke: 'black',
      fill: 'none'
    });
  };

  var output = function(target) {
    return appendToSVG(target,'line',{
      x1: 0,
      y1: 0,
      x2: 55,
      y2: 0,
      stroke: 'black',
      fill: 'none'
    });
  };

  var or = function(target) {
    return appendToSVG(target,'path',{
      d: `M-40,35c-0,0 17.5,-3 17.5,-35c0,-32.5 -17.5,-35 -17.5,-35c27.5,3 45,0 65,35c-15,32 -32.5,32.5 -65,35Z`,
      class: 'gate-body'
    });
  };

  var and = function(target) {
    return appendToSVG(target,'path',{
      d: `M-5,35l-30,0l0,-70l30.194,0c16.366,0 29.806,15.68 29.806,35c0,19.32 -13.44,35 -30,35Z`,
      class: 'gate-body'
    });
  };

  var buffer = function(target) {
    return appendToSVG(target,'path',{
      d: `M-25,-35l50,35l-50,35l0,-70Z`,
      class: 'gate-body'
    });
  };

  var input = function(target, index) {
    var y = -40 + 10 * index;
    return appendToSVG(target,'line',{
      x1: -55,
      y1: y,
      x2: -20,
      y2: y,
      stroke: 'black',
      fill: 'none'
    });
  };

  var inputOffsets = function(count) {
    var result = [];

    if(count % 2 === 1) {
      result.push(4);
    }
    if(count !== 4) {
      if(count > 1) {
        result.push(2);
      }
      if(count > 1) {
        result.push(6);
      }
    }
    if(count > 3) {
      if(count !== 5) {
        result.push(1);
        result.push(7);
      }
      result.push(3);
      result.push(5);
    }

    result.sort();

    return result;
  };

  var inputs = function(target, count) {
    inputOffsets(count).forEach(input.bind(null, target));
  };

  var group = function(target, x, y, aspects, inputCount, rotation) {
    if(typeof rotation === 'undefined') rotation = 3;

    var angle = rotation * 360 / 12 - 90;
    var g = appendToSVG(target,'g',{
      transform: 'translate('+x*110+' '+y*110+') rotate('+angle+')',
      class: 'gate gate-type-xnor'
    });

    inputs(g, inputCount)

    aspects.forEach(function(aspect) {
      aspect(g);
    });

    return g;
  };

  window.logicGates = {
    xnor: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, negation, exclusion, or], inputCount || 2, rotation);
    },

    xor: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, exclusion, or], inputCount || 2, rotation);
    },

    nand: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, negation, and], inputCount || 2, rotation);
    },

    and: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, and], inputCount || 2, rotation);
    },

    nor: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, negation, or], inputCount || 2, rotation);
    },

    or: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, or], inputCount || 2, rotation);
    },

    not: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, buffer, negation], 1, rotation);
    },

    buffer: function(target, x, y, inputCount, rotation) {
      return group(target, x, y, [output, buffer], 1, rotation);
    },
  };


  window.inputOffsets = inputOffsets;
})(window);
