/*TWITTER*/
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
/*TWITTER*/
jQuery(document).ready(function($) {
"use strict";
	
var widthWindow = $(window).width();
        
/*Identificamos si estamos en mobile*/		
if (widthWindow <= 463) {
	$('body').addClass('estoy_en_mobile');
	
	/*Identificamos necesidad de flechas en mobile*/
		$.fn.hasScrollBarmob = function() { return this.get(0).scrollWidth > this.width(); }
		if ($('.estoy_en_mobile .scroll_fino').hasScrollBarmob()){

							$('.estoy_en_mobile .wrapper').removeClass('noflechas');
							$('.estoy_en_mobile .wrapper').removeClass('ocultar_down');
						}
		else{
							$('.estoy_en_mobile .wrapper').addClass('noflechas');
		}
		/*Identificamos necesidad de flechas en mobile*/
}
else{
	$('body').removeClass('estoy_en_mobile');
}
/*Identificamos si estamos en mobile al redimensionar ventana*/	
$(window).on('resize', function(){
	
	var widthWindow = $(window).width();
	
	if (widthWindow <= 463) {
		$('body').addClass('estoy_en_mobile');
	}
	else{
	$('body').removeClass('estoy_en_mobile');
	}	
});
/*Fin Identificamos si estamos en mobile al redimensionar ventana*/	
/*FIN Identificamos si estamos en mobile*/
	
		
	/*Flechas scroll filtro noticias*/
	$('.scrolly').not('.estoy_en_mobile .scrolly').on('click', function() {

		if($(this).hasClass('up')){
			
			$('.scroll_fino').not('.estoy_en_mobile .scroll_fino').animate({
			scrollTop: $(this).position().top},
			'slow');
		}
		else{
			
			$('.scroll_fino').not('.estoy_en_mobile .scroll_fino').animate({
			scrollTop: $('.todas').position().top},
			'slow');
		}
	});
	/*Flechas scroll filtro noticias mobile*/
	$('.estoy_en_mobile .scrolly').on('click', function() {

		if($(this).hasClass('up')){
			
			$('.estoy_en_mobile .scroll_fino').animate({
			scrollLeft: $(this).position().left},
			'slow');
		}
		else{
			
			var anchoul = $('.estoy_en_mobile .filtro-noticias a.activo').next('ul').width();
			
			$('.estoy_en_mobile .scroll_fino').animate({
			scrollLeft: $('.todas').position().left + anchoul},
			'slow');
		}
		
	});
	/*Fin Flechas scroll filtro noticias mobile*/
	
	/*Mostrar/Ocultar Flechas scroll filtro noticias*/
$('.scroll_fino').not('.estoy_en_mobile .scroll_fino').on('scroll', function(){
	
	if($('.scroll_fino').not('.estoy_en_mobile .scroll_fino').scrollTop() == 0 ){
		
		$('.wrapper').not('.estoy_en_mobile .wrapper').addClass('ocultar');
		
	}
	else{
		$('.wrapper').not('.estoy_en_mobile .wrapper').removeClass('ocultar');
	}
	
	var altura_scroll_fino = $('.scroll_fino').not('.estoy_en_mobile .scroll_fino').height() - 22;
	
	
	var scrollposition = Math.trunc($('.todas').not('.estoy_en_mobile .todas').position().top);
	
	
	if(altura_scroll_fino == scrollposition ){
	
		$('.wrapper').not('.estoy_en_mobile .wrapper').addClass('ocultar_down');

	}
	else{
		$('.wrapper').not('.estoy_en_mobile .wrapper').removeClass('ocultar_down');
		
	}

});
	/*Mostrar/Ocultar Flechas scroll filtro noticias mobile*/
$('.estoy_en_mobile .scroll_fino').on('scroll', function(){
	
	if($('.estoy_en_mobile .scroll_fino').scrollLeft() == 0 ){
		
		$('.estoy_en_mobile .wrapper').addClass('ocultar');
		
	}
	else{
		$('.estoy_en_mobile .wrapper').removeClass('ocultar');
	}
	
	var anchura_scroll_fino = $('.estoy_en_mobile .scroll_fino').width() + 9;
	var scrollpositionleft = Math.trunc($('.estoy_en_mobile .todas').position().left + $('.estoy_en_mobile .todas').width());

	if(anchura_scroll_fino == scrollpositionleft ){
	
		$('.estoy_en_mobile .wrapper').addClass('ocultar_down');

	}
	else{
		$('.estoy_en_mobile .wrapper').removeClass('ocultar_down');
		
	}

});
	/*Fin Mostrar/Ocultar Flechas scroll filtro noticias mobile*/
	
	/*Fin Flechas scroll filtro noticias*/
	
	/*Buscanoticias ampliar caja buscador*/
	$('.buscanoticias .form-control').on("focus blur", function() {
		$('.buscanoticias').toggleClass('ampliado');
	});
	/*Fin Buscanoticias ampliar caja buscador*/
	
	/*Filtro noticias acordeon*/
	$('.filtro-noticias ul').css('display','none');
	
	$('.filtro-noticias a').not('.filtro-noticias ul li a').on('click', function(e) {
		e.preventDefault();
		
		if($(this,'.filtro-noticias a').hasClass('activo')){
			
			$(this).next('ul').not('.estoy_en_mobile ul').slideUp(300);
			$(this).removeClass('activo');
			
		}
		else{
		
			var colocar_izq = $('.estoy_en_mobile .scroll_fino').scrollLeft() + $(this).position().left - $('.estoy_en_mobile .filtro-noticias a.activo').next('ul').width();
			
			$('.filtro-noticias a').removeClass('activo');
			$(this).addClass('activo');
			
			$('.estoy_en_mobile .scroll_fino').animate({
			scrollLeft: colocar_izq - 40},
			'slow');
			
			$('.filtro-noticias ul').not('.estoy_en_mobile .filtro-noticias ul').slideUp(300);	

			$(this).next('ul').not('.estoy_en_mobile ul').slideDown(300);
			
			var colocar_top = $('.scroll_fino').scrollTop() + $(this).position().top - $('.filtro-noticias a.activo').next('ul').height();
			
			$('.scroll_fino').not('.estoy_en_mobile .scroll_fino').animate({
			scrollTop: colocar_top - 20},
			'slow');
		}
		
		/*Comprobar si al desplegar acordeon aparece scroll*/
		$.fn.hasScrollBar = function() { return this.get(0).scrollHeight > this.height(); }
		
		setTimeout(function(){
		
			if ($('.scroll_fino').not('.estoy_en_mobile .scroll_fino').hasScrollBar()){
						
						$('.wrapper').not('.estoy_en_mobile .wrapper').removeClass('noflechas');
						
						
						$('.wrapper').not('.estoy_en_mobile .wrapper').removeClass('ocultar_down');
				
							
			}
			else{			
						$('.wrapper').not('.estoy_en_mobile .wrapper').addClass('noflechas');
			}
			
			/*2Comprobar si al desplegar acordeon aparece scroll segun posicion scroll*/
			var altura_scroll_fino = $('.scroll_fino').not('.estoy_en_mobile .scroll_fino').height() - 22;
	
			var scrollposition = Math.trunc($('.todas').not('.estoy_en_mobile .todas').position().top);

			if(altura_scroll_fino == scrollposition ){

			$('.wrapper').not('.estoy_en_mobile .wrapper').addClass('ocultar_down');
			}
			else{
				$('.wrapper').not('.estoy_en_mobile .wrapper').removeClass('ocultar_down');

			}
			/*2Comprobar si al desplegar acordeon aparece scroll*/
			
		}, 600);
		
		/*Fin Comprobar si al desplegar acordeon aparece scroll*/
		
	return false;	
	});
	/*Fin Filtro noticias acordeon*/

});

$(window).on('scroll', function(){ 
	
	var posicion_filtro = $('.filtro-noticias').parent().position();
	var altura_cabecera_animada = $(".cabecera-nueva").height() - 15;
	var distancia_real = posicion_filtro.top - altura_cabecera_animada;
	
	if (this.scrollY >= distancia_real ){
		
		var altura_cabecera = $(".cabecera-nueva").height();
		
		if($( ".follower-ctc" ).hasClass( "down" )  ){					
			
			$('.noticias').addClass('fijado');
			
			if($('.scroll_fino').scrollTop() == 0 ){
				
				$('.wrapper').not('.estoy_en_mobile .wrapper').addClass('ocultar');
				
			}
			
			/*Detectar si div .scroll_fino tiene scroll*/
			$.fn.hasScrollBar = function() { return this.get(0).scrollHeight > this.height(); }

			if ($('.scroll_fino').hasScrollBar()){

				$('.wrapper').not('.estoy_en_mobile .wrapper').removeClass('noflechas');
				
			}
			else{
					
				$('.wrapper').not('.estoy_en_mobile .wrapper').addClass('noflechas');
			}
			/*FIN Detectar si div .scroll_fino tiene scroll*/	
			
			$('.noticias .main').not('.estoy_en_mobile .main').css('margin-left','125px');
			$('.filtro-noticias').not('.estoy_en_mobile .filtro-noticias').css('height','75%');
			$('.filtro-noticias').css('position','fixed');
			$('.filtro-noticias').css('z-index','2');
			$('.filtro-noticias').css('top',altura_cabecera_animada+'px');
			
			
		}
		
		if($( ".follower-ctc" ).hasClass( "up" )  ){
		
			$('.filtro-noticias').css('top',altura_cabecera +'px');
			
			$('body').removeClass('animar-cabecera');

			/*Detectar si div .scroll_fino tiene scroll*/
			$.fn.hasScrollBar = function() { return this.get(0).scrollHeight > this.height(); }

			if ($('.scroll_fino').not('.estoy_en_mobile .scroll_fino').hasScrollBar()){

				$('.wrapper').removeClass('noflechas');
			}
			else{

				$('.wrapper').not('.estoy_en_mobile .scroll_fino').addClass('noflechas');
			}
			/*FIN Detectar si div .scroll_fino tiene scroll*/
		}
		
	}
	else{
		$('.noticias').removeClass('fijado');
		$('.filtro-noticias').css('height','auto');
		$('.noticias .main').not('.estoy_en_mobile .main').css('margin-left','25px');	
		$('.filtro-noticias').css('position','relative');
		$('.filtro-noticias').css('top','auto');
		
	}
	
	var altura_filtro = $(".filtro-noticias").height();
	var altura_cabecera_filtro = altura_cabecera_animada + altura_filtro;
    var distancia_bottom_filtro =  window.innerHeight - altura_cabecera_filtro;
	var posicion_padre = $('.filtro-noticias').parent().offset().top + $('.filtro-noticias').parent().height();	
	var windowTop = $(document).scrollTop();
	var windowBottom = windowTop + window.innerHeight - distancia_bottom_filtro + 30;
	
	if(posicion_padre <= windowBottom){
		$('.noticias').not('.estoy_en_mobile .noticias').addClass('fijado_abajo');	
	}
	else{
		$('.noticias').not('.estoy_en_mobile .noticias').removeClass('fijado_abajo');
	}
	
	if(posicion_padre - $('.sidebar').height() <= windowBottom){
		$('.estoy_en_mobile .noticias').addClass('fijado_abajo');
		$('.estoy_en_mobile .noticias').css('padding-bottom',altura_filtro + 20);
	}
	else{
		$('.estoy_en_mobile .noticias').removeClass('fijado_abajo');
		$('.estoy_en_mobile .noticias').css('padding-bottom','0');
	}
	
}); 