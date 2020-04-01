jQuery(document).ready(function (e) {
	"use strict";
	
	var t = jQuery(location).attr("href"),
		a = e(this).attr("title");
	
	e(".popup.facebook").attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + t + "&title=" + a + "&image=https://www.legalitas.com/docs/pruebas/maqueta/2019/web/images/noticia-destacada.jpg"), e(".popup.twitter").attr("href", "http://twitter.com/intent/tweet?status=" + a + "+" + t), e(".popup.linkedin").attr("href", "https://www.linkedin.com/sharing/share-offsite/?url=" + t), e(".mail").attr("href", "mailto:escribemailamigo1@gmail.com?&body=He%20pensado%20que%20la%20siguiente%20noticia%20podría%20interesarte:%0D%0A%0D%0A" + t + "%0D%0A%0D%0A&cc=escribemailamigo2@gmail.com&bcc=escribemailamigo3@gmail.com&subject=" + a), 1008 <= e(window).width() ? e(".popup.whatsapp").attr("href", "https://api.whatsapp.com/text=He pensado que la siguiente noticia podría interesarte:%0D%0A" + t) : e(".popup.whatsapp").attr("href", "whatsapp://send?text=He pensado que la siguiente noticia podría interesarte:%0D%0A" + t), e(".popup").click(function (t) {
		t.preventDefault(), window.open(e(this).attr("href"), "", "width=800,height=600,scrollbars=yes")
	})
	
	$(".noticias.interior .main .activador").one("click",function(){$(".noticias.interior .main .activador").addClass("mostrar")})
	
});