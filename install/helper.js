(function(){

  if (!document.querySelector || !document.body.getBoundingClientRect)
    return;

  var options = INSTALL_OPTIONS;

  for (var i=0; i < options.regions; i++){
    var reg = options.regions[i];

    var els = document.querySelectorAll(reg.location);
    if (!els) continue;

    for (var j=0; j < els.length; j++){
      size = els[j].getBoundingClientRect();

      var tri = window.Trianglify({
        width: size.width,
        heigth: size.height,
        cell_size: options.size,
        x_colors: options.colors,
        variance: options.variance
      });

      els[j].style.background = "url(" + tri.png() + ") 0 0 auto auto no-repeat"
    }
  }

})()
