/*
 *  Plugin que valida los formularios - 21/06/2012
 *  Modificacion: 22/11/2012 --- Agregada funcionalidad de numero minimo de aciertos
 *  Jonathan Bailon Segura
 *  jonn59@gmail.com
 */
jQuery.fn.validForm = function (options) {
  var settings = jQuery.extend(
    {
      retro: ".retro",
      errorDialog: false,
      errorForm: false,
      errorBackground: "#FCDBD6",
      errorBorder: "solid 1px #C82C27",
      numAcierto: 0,
      textoRetro: "#textoRetro",
    },
    options
  );

  var raiz = jQuery(this);

  /*
   * Funcion que valida los elementos inputs del formulario
   */

  function vFormulario(form, acierto) {
    var retorno = new Array();
    retorno[0] = true;
    retorno[1] = 0;

    // Obtemos todos los inputs text dentro del array
    var $inputs = jQuery(":input[type=text], textarea", form);

    $inputs.each(function () {
      var $este = jQuery(this);
      if (!isVacio($este.val())) {
        retorno[0] = false;
        if (settings.numAcierto == 0) {
          $este.css({
            background: settings.errorBackground,
            border: settings.errorBorder,
          });
        }
      } else {
        $este.css({
          // quitamos el fondo rojo si este esta lleno
          background: "",
          border: "",
        });
        retorno[1]++;
      }
    });
    return retorno;
  }

  /*
   * Funcion que valida que un campo sea completado
   * @retun bool
   */
  function isVacio(val) {
    if (jQuery.trim(val).length <= 0) return false;
    return true;
  }

  jQuery(settings.retro, this).hide();
  //jQuery(settings.textoRetro,this).hide();

  jQuery(this).submit(function (event) {
    event.preventDefault();
    jQuery(settings.textoRetro, this).hide();
    respuesta = vFormulario(this);
    if ( respuesta[0] || (respuesta[1] >= settings.numAcierto && settings.numAcierto > 0 )) {
      jQuery(settings.retro, this).fadeIn("slow");
      jQuery(":submit", this).hide();
    } else {
      if (settings.errorDialog != false) {
        jQuery(settings.errorDialog).addClass("dialog");
        jQuery(settings.errorDialog).dialog("open");
      }
      if (settings.errorForm != false) {
        jQuery(settings.errorForm, this).fadeIn("slow");
      }
    }
    if (respuesta[1] < settings.numAcierto) {
      //jQuery(this).append("<div id='errorRetro' class='dialog' title='Completa todas las respuestas' style='display:none'><p>Escribe por lo menos "+settings.numAcierto+" diferencias para que puedas recibir retroalimentación.</p></div>")
      jQuery(settings.textoRetro).dialog("open");
      //jQuery("div#errorRetro",this).dialog();
    }
  });
};

jQuery(document).ready(function () {
  jQuery("#dialog").dialog({ autoOpen: false, modal: true });
});
