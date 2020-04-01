jQuery(document).ready(function($) {
"use strict";
	
		var valorcookie = Cookies.get('popupCookie');
		
		
$(function() {

	
	if( typeof(valorcookie)  === "undefined")
	
	{
	
	$("#modallegalitascontigo").modal();
	Cookies.set('popupCookie','visto');
		
	}
	
});
		
});