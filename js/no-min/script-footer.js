jQuery(document).ready(function($) {
"use strict";
	
//Pulsar mas productos pie	
$(".subirydesplegar").click(function() {
	
$('html, body').animate({
			scrollTop: $('html, body').offset().top},
			'200');
		
$('.menu-nuevo ul.menu-links li:nth-child(3)').not($('.menu-nuevo ul.menu-links li:nth-child(3) .group-submenu.simple ul.new-submenu li')).addClass('desplegado');
});
//Pulsar mas productos pie	
	

	
});