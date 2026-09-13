(function () {
  "use strict";

  // Buscamos la nueva clase del formulario de Google
  let forms = document.querySelectorAll('.google-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      // REEMPLAZA ESTA URL POR LA TUYA DE GOOGLE (La que termina en /exec)
      let action = "https://script.google.com/macros/s/AKfycbwgNEwbCNB6QbfV8FoM0BJRXshmZ_D1nAhst5SAd4ZMadudgV_33OSQw5HWhiPd5SY/exec"; 
      
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'google_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                google_apps_script_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, "Error en reCAPTCHA: " + error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else {
        google_apps_script_submit(thisForm, action, formData);
      }
    });
  });

  // Función para enviar los datos a Google Sheets y Gmail
  function google_apps_script_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
    .then(() => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.add('d-block');
      thisForm.reset(); 
    })
    .catch((error) => {
      displayError(thisForm, "Algo fue mal por favor vuelve a intentarlo o utiliza el resto de vías de contacto.");
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();