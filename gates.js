(function() {

  window.logicGates = {
    and: function(target, x, y) {
      var group = appendToSVG(target,'g',{
        transform: 'translate('+x+' '+y+')',
        class: 'gate gate-type'
      });

      var input1 = appendToSVG(group,'path',{
        d: 'M 102,51 l 90,0',
        class: 'gate-port'
      });

      var input2 = appendToSVG(group,'path',{
        d: 'M 102,129 l 90,0',
        class: 'gate-port'
      });

      var output = appendToSVG(group,'path',{
        d: 'M 300,90 l 50,0',
        class: 'gate-port'
      });

      var body = appendToSVG(group,'path',{
        d: 'M 148,169.24997 C 147.86307,169.25544 189.01219,161.81425 189.01219,89.999999 C 189.01219,17.478772 147.99697,10.749695 148,10.750027 C 214.25305,18.014053 257.40202,7.7267425 303,90.000005 C 269,162.74602 224.41039,166.19896 148,169.24997 z',
        class: 'gate-body'
      });
    }
  };

})(window);
