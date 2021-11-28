/*
 *  Plugin que valida los formularios v2- 27/12/2021
 *  UNAM - DGCCH
 *  Jonathan Bailon Segura
 *  jonn59@gmail.com
 */

;(function ($, window, document, undefined) {
  "use strict";

  // Create the defaults once
  var pluginName = "validForm",
    defaults = {
      retro: ".retro",
      errorDialog: false,
      errorForm: false,
      errorBackground: "#FCDBD6",
      errorBorder: "solid 1px #C82C27",
      numAcierto: 0,
      textoRetro: "#textoRetro",
      respuestas: ""
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function () {
      let settings = this.settings;
      let form = this;
      const dialog = jQuery(settings.errorDialog, this.element);
      const errorForm = jQuery(settings.errorForm, this.element);
      const textoRetro = jQuery(settings.textoRetro, this.element);

      jQuery(settings.retro, this.element).hide();
      dialog.hide();

      
      
      jQuery(this.element).submit(function(event) {
        let respuesta = form.vFormulario(this);

        event.preventDefault();
        jQuery(settings.textoRetro, this).hide();
        
        if ( respuesta[0] || ( ( respuesta[1]  >= settings.numAcierto ) && ( settings.numAcierto > 0 ) ) ) {
          jQuery(settings.retro, this).fadeIn("slow");
          jQuery(":submit, .alert-danger", this).hide();
        } else {
          if (settings.errorDialog != false) {
              dialog.addClass([ "alert", "alert-danger" ]).fadeIn("slow");
          }
          if (settings.errorForm != false) {
            errorForm.addClass([ "alert", "alert-danger" ]).fadeIn("slow");
              
          }
        }

        if( respuesta[1]  < settings.numAcierto ){
          textoRetro.addClass([ "alert", "alert-danger" ]).fadeIn("slow");
        }
      });
    },
    /*
	    * Funcion que valida los elementos inputs del formulario
	  */
    vFormulario: function (form) {
      let retorno = [true,0];
      let settings = this.settings;
      let elem = this;
      let cont = 0;
      
      // Obtemos todos los inputs text dentro del array
      const $inputs = jQuery(':input[type=text], textarea', form);

      $inputs.each(function() {
        let $este = jQuery(this);
        let vacio = true;
      
        jQuery.trim($este.val()).length <= 0  ? vacio = false : vacio = true;

        if ( !vacio ) {
          retorno[0] = false;
          if ( settings.numAcierto == 0 ){
            $este.css({
              'background' : settings.errorBackground,
              'border' : settings.errorBorder
            });
          }
        } else {
          $este.css({ // quitamos el fondo rojo si este esta lleno
            'background' : '',
            'border' : ''
          });

          if(settings.respuestas != ""){
            if (elem.removeAccents(settings.respuestas[cont].toLowerCase()) == elem.removeAccents($este.val().toLowerCase())) {
              $este.addClass("success");
              $este.siblings(".retro").addClass("success");
            } else {
              $este.addClass("error");
              $este.siblings(".retro").addClass("error");
            }
            cont++;
          }
          retorno[1]++;
        }
      }); 

      return retorno;
    },
    removeAccents: function (str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
  });

 $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
