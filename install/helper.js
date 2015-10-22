(function(){

  if (!document.querySelector || !document.documentElement.getBoundingClientRect || !document.addEventListener)
    return;

  var options = INSTALL_OPTIONS;
  var pendingRegions = options.regions;

  var styleCont = '';
  for (var i=0; i < pendingRegions.length; i++){
    styleCont += pendingRegions[i].location + " { opacity: 0; }\n"
  }

  var style = document.createElement('style');
  style.innerHTML = styleCont;
  document.head.appendChild(style);

  var trianglify = function(el, reg){
    // We need default sizes because with MutationObserver we could easily be running before this element
    // attains it's full size.  We could rerender as it's children are populated, but that causes the rendering
    // to change as the page loads.
    var tri = window.Trianglify({
      width: 3000,
      height: 3000,
      cell_size: reg.size,
      x_colors: reg.colors,
      variance: reg.variance / 100
    });

    el.style.background = "url(" + tri.png() + ") no-repeat"
    el.style.backgroundSize = 'cover'

    // It takes a non-trivial amount of time to generate the triangles, so we hide the element to prevent a flash
    el.style.opacity = '1';
  }

  var checkNode = function(node){
    if (node.nodeType == 1){
      for (var i=0; i < pendingRegions.length; i++){
        if (node.matches(pendingRegions[i].location)){
          trianglify(node, pendingRegions[i]);

          pendingRegions.splice(i, 1);
          i--;

          return true;
        }
      }
    }
    return false;
  }

  if (window.MutationObserver != null) {
    var observer = new MutationObserver(function(mutations) {
      for (var i=0; i < mutations.length; i++){
        var addedNodes = mutations[i].addedNodes;
        for (var j=0; j < addedNodes.length; j++){
          if (checkNode(addedNodes[j])){
            break;
          }
        }
      }

      if (pendingRegions.length == 0 || document.readyState == 'complete'){
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

  } else {
    var load = function(){
      for (var i=0; i < pendingRegions.length; i++){
        var reg = pendingRegions[i];

        var els = document.querySelectorAll(reg.location);
        if (!els) continue;

        for (var j=0; j < els.length; j++){
          trianglify(els[i], reg);
        }
      }
    }

    if (document.readyState == 'complete'){
      load();
    } else {
      document.addEventListener('DOMContentLoaded', load);
    }
  }

})()
