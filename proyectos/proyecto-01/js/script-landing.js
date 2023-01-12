jQuery(document).ready(function($) {



//Loader
$("a.loader.boton").click(function(event) {
  $("a.loader.boton").addClass("loading"); 
  $('a.loading span').text('Enviando mensaje...');
});
            
  
//Navegacion en la misma pagina
function goToByScroll(id){
      // Remove "link" from the ID
    id = id.replace("-link", "");
      // Scroll
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top},
        'slow');
}
$(".menu > ul > li > a, .gotomenu a, .gotoform").click(function(e) { 
      // Prevent a page reload when a link is pressed
    e.preventDefault(); 
      // Call the scroll function
    goToByScroll(this.id);           
}); 

//Menu mobile - Hamburguesa animada
	$(".hamburguesa-animada").click(function(event) {
	   $(this).toggleClass('activo');
	   $('.menu ul').slideToggle( "fast", function() {});
	   
	});


	//Listados desplegables
	$("ul.desplegable li").click(function(event) {
	   $(this).toggleClass('desplegado');
	   $(this).find('ul').slideToggle( "fast", function() {});
	   
	});
	
	//Leer mas
    
	$('.informacion-principal.ampliable .boton').click(function(event) {
		$('.informacion-principal.ampliable .campo-extra').slideToggle( "fast", function() {});
		
		$('.informacion-principal.ampliable').toggleClass('ampliado');
		
		$('.informacion-principal.ampliable .boton').text('Leer más');
		$('.ampliado .boton').text('Cerrar');
	});
	
	$('.informacion-principal.ampliable-02 .boton').click(function(event) {
		$('.informacion-principal.ampliable-02 .campo-extra').slideToggle( "fast", function() {});
		
		$('.informacion-principal.ampliable-02').toggleClass('ampliado');
		
		$('.informacion-principal.ampliable-02 .boton').text('Leer más');
		$('.ampliado .boton').text('Cerrar');
	});
	
	//Campos ocultos formulario
	$('.formulario input , .formulario textarea').click(function(event) {
		$('.formulario .campo-extra').slideDown(200);
		$(".formulario").addClass("rellenando");	
	});
	/*$('.formulario').mouseleave(function(event) {
		
		$('.campo-extra').hide(200);
	
		$(".formulario").removeClass("rellenando");
	});*/
	
	
	
	
	//Cerrar
	$('#cerrar').click(function() {
	$("body").addClass("no-mostrar-ctf");
	});
	//aparece div cuando hacemos scroll
	window.onscroll = function() {
	
	    var alto = document.getElementById('loguera').offsetHeight;
		var alto2 = document.getElementById('cabecera').offsetHeight;
		var alto3 = document.getElementById('informacion-principal-01').offsetHeight;
		var alto4 = document.getElementById('informacion-principal-02').offsetHeight;
		var alto5 = document.getElementById('informacion-principal-03').offsetHeight;
		var alto6 = document.getElementById('informacion-principal-04').offsetHeight;
		var alto7 = document.getElementById('informacion-principal-05').offsetHeight;
		var alto8 = document.getElementById('valores').offsetHeight;
		var alto9 = document.getElementById('click-to-action').offsetHeight;
		

        if (window.pageYOffset >= (alto + 0)){
            $('body').addClass("mostrar-gotomenu");
        }
		if (window.pageYOffset <= (alto + 0)){
            $('body').removeClass("mostrar-gotomenu");
        }

        if (window.pageYOffset >= (alto + alto2 + alto3 + alto4 + alto8 + alto9 + 0)){
            $('body').addClass("mostrar-ctf");
        }
		if (window.pageYOffset <= (alto + alto2 + alto3 + alto4 + alto8 + alto9 + 0)){
            $('body').removeClass("mostrar-ctf");
        }
		
		if (window.pageYOffset >= (alto + alto2 + alto3 + alto4 + alto5 + alto8 + alto9 + (-300))){
            $('.informacion-principal.black').addClass("accion");
        }
		if (window.pageYOffset <= (alto + alto2 + alto3 + alto4 + alto5 + alto8 + alto9 + (-300))){
            $('.informacion-principal.black').removeClass("accion");
        }
		
		if (window.pageYOffset >= (alto + alto2 + alto3 + alto4 + alto8 + alto9 + (-100))){
            $('.mapa').addClass("fallin");
        }
		if (window.pageYOffset <= (alto + alto2 + alto3 + alto4 + alto8 + alto9 + (-100))){
            $('.mapa').removeClass("fallin");
        }
		
    }; 


});
