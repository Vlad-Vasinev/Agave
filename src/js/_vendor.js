import './vendor/focus-visible.js';
import $ from 'jquery';
$('div')
window.jQuery = $;
window.$ = $;
jQuery.fn.load = function (callback) {
  var el = $(this);

  el.on('load', callback);

  return el;
};
import "../../node_modules/zoomove/dist/zoomove.js"
