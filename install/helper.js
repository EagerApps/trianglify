(function(){

  if (!document.querySelector || !document.body.getBoundingClientRect)
    return;

  var options = INSTALL_OPTIONS;

  for (var i=0; i < options.regions.length; i++){
    var reg = options.regions[i];

    var els = document.querySelectorAll(reg.location);
    if (!els) continue;

    for (var j=0; j < els.length; j++){
      var size = els[j].getBoundingClientRect();

      var tri = window.Trianglify({
        width: size.width,
        height: size.height,
        cell_size: reg.size,
        x_colors: reg.colors,
        variance: reg.variance / 100
      });

      els[j].style.background = "url(" + tri.png() + ") no-repeat"
      els[j].style.backgroundSize = 'contain'
    }
  }

})()
