jQuery(document).ready(function($) {
"use strict";
//CALLYOU (1/3) (OFFLINE FORMULARIO) Campos ocultos

	$('.callyou-offline .click-you input').click(function() {
		$('.escondidos').slideDown(200);
	});
	$('.mostrar-infhorario-box').click(function() {
		$('.infhorario-box').slideDown(200);
	});
	$('.cerrar-infhorario-box').click(function() {
		$('.infhorario-box').slideUp(200);
	});
//FIN CALLYOU (1/3) (OFFLINE FORMULARIO) Campos ocultos	
	
	
	
$(window).scroll(function(){
	
//CALLYOU (2/3) (OFFLINE FORMULARIO) Esconder campos ocultos y cerrar infhorario-box
		
						$('.callyou-offline .infhorario-box').slideUp(200);
						$('.callyou-offline .escondidos').slideUp(200);
						$(".callyou-offline .click-you .escondidos input:first").focus();
	
//FIN CALLYOU (2/3) (OFFLINE FORMULARIO) Esconder campos ocultos y cerrar infhorario-box
	
		
	
//CABECERA ANCLABLE (1/2) (ANIMACION)
	
		
if($( ".follower-ctc" ).hasClass( "down" )  ){
					
	$('body').addClass('animar-cabecera');
	
}
	
if($( ".follower-ctc" ).hasClass( "up" )  ){
					
	$('body').removeClass('animar-cabecera');
	
}
	
//FIN CABECERA ANCLABLE (1/2) (ANIMACION)	
	
});
	
//CLICK TO CALL QUE TE SIGUE
	
	setTimeout(function(){
		
		$('.follower-ctc').addClass('following');  
		
	}, 3000);
	
	var CurrentScroll = 0;
	
	$(window).scroll(function(){
      
      var NextScroll = $(this).scrollTop();

      if (NextScroll > CurrentScroll){
$('.follower-ctc').addClass('down');
setTimeout(function(){
$('.follower-ctc').removeClass('down');  
}, 300);
}
else {          
$('.follower-ctc').addClass('up');
setTimeout(function(){
		
$('.follower-ctc').removeClass('up');  
		
}, 300);
      }

      CurrentScroll = NextScroll;  //Updates current scroll position
  });
//CLICK TO CALL QUE TE SIGUE
	
	
	
	
	
//MENU ESCRITORIO:
	
//Cerrar menu al hacer click fuera
		$("html").click(function() {
			$('li').removeClass('desplegado');
		});

		$('.menu-links, .tarjeta, .subirydesplegar').click(function (e) {
			e.stopPropagation();
		});
    //Fin Cerrar menu al hacer click fuera
	
	
	//FICHAS MENU PARTICULARES:
	
											
											
	$(".menu-nuevo ul.menu-links li").click(function() {

		$('.group-submenu ul.new-submenu li').removeClass('activado');
		
		$('.menu-nuevo ul.menu-links li').not($(this)).removeClass('desplegado');
		
		
		$(this).toggleClass('desplegado');
			
//Hacer scroll animado hasta:
		
		
		var altura_cabecera_nueva = $(".cabecera-nueva").height();
		
		
		var distancia_menu = $(".menu-links li.desplegado").offset().top;
		
		
		var diferencia = distancia_menu - altura_cabecera_nueva;
		
		var widthWindow = $(window).width();
        
		
		if (widthWindow >= 1008) {
		
        }
		else {
		$('html, body').animate({scrollTop: diferencia }, 800);
		}
		
});
	
	$(".group-submenu ul.new-submenu li").hover(function() {
    
		
		$('.group-submenu ul.new-submenu li').not($(this)).removeClass('activado');
		$(this).addClass("activado");
		
	});
	$(".group-submenu.particular ul.new-submenu li:eq(0)").hover(function() {
    
		$('.group-submenu.particular div.tarjeta').not($(this)).removeClass('mostrarla');
		$('.group-submenu.particular div.tarjeta:eq(0)').addClass("mostrarla");
		
	});
	$(".group-submenu.particular ul.new-submenu li:eq(1)").hover(function() {
    
		$('.group-submenu.particular div.tarjeta').not($(this)).removeClass('mostrarla');
		$('.group-submenu.particular div.tarjeta:eq(1)').addClass("mostrarla");
		
	});
	$(".group-submenu.particular ul.new-submenu li:eq(2)").hover(function() {
    
		$('.group-submenu.particular div.tarjeta').not($(this)).removeClass('mostrarla');
		$('.group-submenu.particular div.tarjeta:eq(2)').addClass("mostrarla");
		
	});
	//FIN FICHAS MENU PARTICULARES:
	
	
	
	//FICHAS MENU PRO:
	
	$(".group-submenu.pro ul.new-submenu li:eq(0)").hover(function() {
    
		$('.group-submenu.pro div.tarjeta').not($(this)).removeClass('mostrarla');
		$('.group-submenu.pro div.tarjeta:eq(0)').addClass("mostrarla");
		
	});
	$(".group-submenu.pro ul.new-submenu li:eq(1)").hover(function() {
    
		$('.group-submenu.pro div.tarjeta').not($(this)).removeClass('mostrarla');
		$('.group-submenu.pro div.tarjeta:eq(1)').addClass("mostrarla");
		
	});
	$(".group-submenu.pro ul.new-submenu li:eq(2)").hover(function() {
    
		$('.group-submenu.pro div.tarjeta').not($(this)).removeClass('mostrarla');
		$('.group-submenu.pro div.tarjeta:eq(2)').addClass("mostrarla");
		
	});
	
});
//FIN MENU ESCRITORIO:





$(window).load(function() {
"use strict";		
	
//SUBMENU MOBILE NUEVO
	
var altura_cabecera_mobile = $(".cabecera-nueva").height();
	
$('.submenu-mobile, .trimenu-mobile').css('top', altura_cabecera_mobile +'px');

$(".menu-mobile .opcion-01").click(function() {
    
	$('.submenu-mobile.particular').addClass('visible');
	
	setTimeout(function(){	
	$('.submenu-mobile.particular').addClass('animacion-top');  
    }, 300);
		
});
$(".menu-mobile .opcion-02").click(function() {
    
	$('.submenu-mobile.negocio').addClass('visible');
	
	setTimeout(function(){	
	$('.submenu-mobile.negocio').addClass('animacion-top');  
    }, 300);
		
});
$(".menu-mobile .opcion-03").click(function() {
    
	$('.submenu-mobile.otros').addClass('visible');
	
	setTimeout(function(){	
	$('.submenu-mobile.otros').addClass('animacion-top');  
    }, 300);
		
});
$(".menu-mobile, .submenu-mobile").click(function() {
    
	$('html, body').animate({
			scrollTop: $("html, body").offset().top},
			'slow');
		
});	
		
$(".submenu-mobile.particular .opcion-01b").click(function() {
    
	$('.trimenu-mobile.particular.a').addClass('visible');
	
	setTimeout(function(){	
	$('.trimenu-mobile.particular.a').addClass('animacion-right');  
    }, 300);
		
});
$(".submenu-mobile.particular .opcion-02b").click(function() {
    
	$('.trimenu-mobile.particular.b').addClass('visible');
	
	setTimeout(function(){	
	$('.trimenu-mobile.particular.b').addClass('animacion-right');  
    }, 300);
		
});
$(".submenu-mobile.particular .opcion-03b").click(function() {
    
	$('.trimenu-mobile.particular.c').addClass('visible');
	
	setTimeout(function(){	
	$('.trimenu-mobile.particular.c').addClass('animacion-right');  
    }, 300);
		
});
		
$(".submenu-mobile.negocio .opcion-01b").click(function() {
    
	$('.trimenu-mobile.negocio.a').addClass('visible');
	
	setTimeout(function(){	
	$('.trimenu-mobile.negocio.a').addClass('animacion-right');  
    }, 300);
		
});
$(".submenu-mobile.negocio .opcion-02b").click(function() {
    
	$('.trimenu-mobile.negocio.b').addClass('visible');
	
	setTimeout(function(){	
	$('.trimenu-mobile.negocio.b').addClass('animacion-right');  
    }, 300);
		
});
$(".submenu-mobile.negocio .opcion-03b").click(function() {
    
	$('.trimenu-mobile.negocio.c').addClass('visible');
	
	setTimeout(function(){	
	$('.trimenu-mobile.negocio.c').addClass('animacion-right');  
    }, 300);
		
});		
		
$(".submenu-mobile .atras").click(function() {
	
	$('.submenu-mobile').removeClass('animacion-top');
	
	setTimeout(function(){	
	$('.submenu-mobile').removeClass('visible'); 
    }, 300);
	
});
$(".trimenu-mobile .atras").click(function() {
    
	$('html, body').animate({
			scrollTop: $("html, body").offset().top},
			'slow');
	
	$('.trimenu-mobile').removeClass('animacion-right'); 
	
	setTimeout(function(){	
	$('.trimenu-mobile').removeClass('visible'); 
    }, 300);
	
});
//FIN SUBMENU MOBILE NUEVO
	

//CABECERA ANCLABLE (2/2) Calcular hueco que deja cabecera anclada
	
	
	var altura_cabecera_nueva = $(".cabecera-nueva").height();
	
	$('body').css('padding-top', altura_cabecera_nueva +'px');
	
	
	$(window).on('resize', function(event) {
        event.preventDefault();
        
		var altura_cabecera_nueva = $(".cabecera-nueva").height();
$('body').css('padding-top', altura_cabecera_nueva +'px');
		
        });
	
//FIN CABECERA ANCLABLE (2/2) Calcular hueco que deja cabecera anclada
	

//CALLYOU (3/3) cambio de textos callyou
	$('.callyou-online .click-you .ctc-direct a').text('LLÁMAME');
	$('.callyou-online .click-you .ctc-direct input').attr("placeholder", "Número de contacto");
  
//FIN CALLYOU (3/3) cambio de textos callyou
});