jQuery(document).ready(function($) {
"use strict";

//Compartir contenido plugin	
$('.noticias.interior .main .activador').one('click', function() {
	
	
	$('.noticias.interior .main .activador').prepend('<div class="sharethis-inline-share-buttons"></div>');
	$('<script>').attr({
		src: '//platform-api.sharethis.com/js/sharethis.js#property=5b3caa6647b80c0011966473&product=inline-share-buttons',
		type: 'text/javascript',
		async:'async'}).prependTo('body');	

	setTimeout(function(){
		
		$('.noticias.interior .main .activador').addClass('mostrar');  
		
	}, 300);
	
	});
	
});	