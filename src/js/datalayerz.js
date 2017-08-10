/*!
  Datalayerz v.0.5
  GTM / dataLayer vars and events manager
  Doc and samples at: https://github.com/carloscabo/Datalayerz

  Authors:
  - Carlos Cabo   ( https://github.com/carloscabo   )
  - Victor Ortíz  ( https://github.com/vortizhe     )
  - Julia Vallina ( https://github.com/juliavallina )
*/
(function ($, undefined) {
  'use strict';

  // Prevent several initializations
  if (typeof window.Datalayerz !== 'undefined') {
    return;
  }

  var
    $doc = $(document);

  function init($content) {
    if (typeof $content === 'undefined') {
      $content = $('body')
    };

    $content.find('[data-datalayer-children]').each(function (idx, el) {
      var
        $el = $(el),
        data = $el.attr('data-datalayer-children');
      $el.children().each(function (idx, child) {
        // If element has its own data-attr don't overwrite
        if (!$(child)[0].hasAttribute('data-datalayer')) {
          $(child).attr('data-datalayer', data);
        }
      });
      $el.removeAttr('data-datalayer-children'); //.removeData('datalayerChildren');
    });

    $content.find('[data-datalayer]').each(function (idx, el) {
      var
        dat = $(el).data('datalayer');
      // First evet has a trigger
      if (dat.length && typeof dat[0].trigger !== 'undefined') {
        activate_events(el);
      }
    });

  }

  function activate_events(el) {

    var
      // Element
      $el = $(el),
      // Original data unmodified
      data_events = $el.data('datalayer');

    $.each(data_events, function (idx, data_event) {

      $el.on(data_event.trigger, function (e) {
        // e.preventDefault(); // DEBUG

        // Copy to be send
        var data_event_copy = {};
        data_event_copy = $.extend({}, data_event);

        // General
        $.each(data_event_copy, function (key, val) {

          val = val.replace(/\"/g, "\""); // Unescape
          // console.log(key); console.log(val);
          // debugger;

          var
            // Is there a value like {{page.hierarchy}}
            m = val.match(/^{{(.*)}}$/),

            // jQuery method on element $el.text()
            f = val.match(/^\$\((?:")?([^"]+)(?:")?\)\.(text|val|data|attr)\((?:")?([^"]+)?(?:")?\)$/),

            // Window function
            w = val.match(/^window\.(.*)/)

          // Check for existance of dataLayer variable
          // {{page.hierarchy}}
          if (m && m[1] && dataLayer && dataLayer[0] && dataLayer[0][m[1]]) {
            data_event_copy[key] = dataLayer[0][m[1]];
          }

          // Is a JQuery function?
          // Must be in a subset of allowed JS fuctions
          // $("#element-id_or-id").attr("data-attr")

          // Matches
          // 1.	#element-id_or-id // el is an especial case
          // 2. attr              // jQuery method
          // 3. data-attr         // param to the jQuery method

          else if (f && f[1] && f[2]) { // && typeof $.fn[ f[2] ] === 'function'
            // data_event_copy[key] = $el[ f[1] ]();
            var
              // $(el) is magical
              $sel = (f[1] === 'el') ? $(el) : $(f[1]),
              str = '';

            if ($sel.length) {
              if (typeof f[3] !== 'undefined') {
                str = $sel[f[2]](f[3]);
              } else {
                // $.text() dont work fine passing an undefined param... :-/
                str = $sel[f[2]]();
              }
            }
            data_event_copy[key] = str;

          }

          // is a global function?
          else if (w && w[0] && typeof window[w[0]] === 'function') {
            data_event_copy[key] = window[w[0]]();
          }

        });
        dataLayer.push(data_event_copy);
      });

    });

  }

  // Public methods
  window.Datalayerz = {
    init: init
  };

}(jQuery));

/*
// Initilize in domready
$(function(){
  window.Datalayerz.init();
});
*/