(function() {

  window.logicGates = {
    xnor: function(target, x, y) {
      var group = appendToSVG(target,'g',{
        transform: 'translate('+x+' '+y+')',
        class: 'gate gate-type'
      });

      var input1 = appendToSVG(group,'line',{
        x1: -55,
        y1: -20,
        x2: 0,
        y2: -20,
        stroke: 'black',
        fill: 'none'
      });


      var input2 = appendToSVG(group,'line',{
        x1: -55,
        y1: 20,
        x2: 0,
        y2: 20,
        stroke: 'black',
        fill: 'none'
      });



      var output = appendToSVG(group,'line',{
        x1: 0,
        y1: 0,
        x2: 55,
        y2: 0,
        stroke: 'black',
        fill: 'none'
      });

      var body = appendToSVG(group,'path',{
        d: `M-40,35c-0,0 17.5,-3 17.5,-35c0,-32.5 -17.5,-35 -17.5,-35c27.5,3 45,0 65,35c-15,32 -32.5,32.5 -65,35Z`,
        class: 'gate-body'
      });

      var negation = appendToSVG(group,'circle',{
        cx: 35,
        cy: 0,
        r: 10
      });

      var x = appendToSVG(group,'path',{
        d: `M-50,35c0,0 17.5,-3 17.5,-35c0,-32.5 -18,-35 -18,-35`,
        stroke: 'black',
        fill: 'none'
      });
    }
  };

})(window);
