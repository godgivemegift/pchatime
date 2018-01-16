//1 Preloader

$(window).load(function() { // makes sure the whole site is loaded
			$("#status").fadeOut(); // will first fade out the loading animation
			$("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.
		})
		
var speed = 250,
animationComplete = true,
current_url = document.URL;

var splited = current_url.split("#");
var curr_page = splited[1];

var current_banner = 0;


$(document).ready(function (){
	
	//PNG fix for IE
	$.fn.pngFix = function() {
  	if (!$.browser.msie || $.browser.version >= 9) { return $(this); }

  	return $(this).each(function() {
    var img = $(this),
        src = img.attr('src');

    img.attr('src', './images/transparent.gif')
        .css('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='crop',src='" + src + "')");
  	});
	};
	
	$('#goodtime .prev .hover, #goodtime .prev .normal').pngFix();
	$('img, li').pngFix();
	$('div.normal, div.hover').pngFix();
	$('#drinkselection1 #drink1, #drinkselection2 #drink1, #drinkselection3 #drink1').pngFix();
	$('#drinkselection1 li').pngFix();
	
	//Initialize
	
    moveToPage(curr_page);

    $(window).scroll(function(){
        /* set page at url */
        if(!$("html").hasClass('ie')){
            pageOfPosition($(window).scrollTop());
        }
    });

    
    // NAVIGATION
    $('#header a').click(function(){
		if(!$('.center')){
            activeThis($(this), '#header a');
        }
        moveToPage($(this).attr('data-page'));
    });
	
	$('#rewards .email_us').click(function(){	
	
            moveToPage($(this).attr('data-page'));
     
    });
	
	/* NEWS */
	
	current_news = 0;
	news_counter = $("#news .navigation li").index();
	
	$('#news .prev').click(function(){
        current_news  --;
		if (current_news  < 0) {
			current_news = news_counter;
		}	
        moveToCurrentBanner(current_news , '#news ul.carousel_home' , 900, true);
    });
	
	$('#news .next').click(function(){
        current_news  ++;
		if (current_news > news_counter) {
			current_news = 0;
		}
       moveToCurrentBanner(current_news , '#news ul.carousel_home' , 900, true);
    });
	
	$('#news .navigation li').click(function(){
		current_news = $(this).index();
        moveToCurrentBanner(current_news , '#news ul.carousel_home' , 900, true);
    });
	
	$("#news .navigation li").hover(
        function(){if(!$(this).hasClass('active')) fadeHover($(this), true);},
        function(){if(!$(this).hasClass('active')) fadeHover($(this), false);}
    );
	
	$("#news .prev").hover(
        function(){fadeHover($(this), true);},
        function(){fadeHover($(this), false);}
    );

    $("#news .next").hover(
        function(){fadeHover($(this), true);},
        function(){fadeHover($(this), false);}
    );
	

	/* GOODTEA */
    
    /*$('#goodtea .prev').hide();*/
	current_goodtea_banner = 0;
	goodtea_counter = $("#goodtea .navigation li").index();
	
	$('#goodtea .prev').click(function(){
        current_goodtea_banner  --;
		
		if (current_goodtea_banner < 0) {
			current_goodtea_banner = goodtea_counter;
		} 
        moveToCurrentBanner(current_goodtea_banner , '#goodtea ul.carousel_home' , 900, true);
    });
	
	$('#goodtea .next').click(function(){
        current_goodtea_banner  ++;
		
		if (current_goodtea_banner  > goodtea_counter) {
			current_goodtea_banner = 0;
		}	
       moveToCurrentBanner(current_goodtea_banner , '#goodtea ul.carousel_home' , 900, true);

    });
	
	$('#goodtea .navigation li').click(function(){
		current_goodtea_banner = $(this).index();
        moveToCurrentBanner(current_goodtea_banner , '#goodtea ul.carousel_home' , 900, true);
		//$("#counter").text("There are " + goodea_counter + " divs. Click to add more." +  current_goodea_banner);
    });
	
	$("#goodtea .navigation li").hover(
        function(){if(!$(this).hasClass('active')) fadeHover($(this), true);},
        function(){if(!$(this).hasClass('active')) fadeHover($(this), false);}
    );

	
	$("#goodtea .prev").hover(
        function(){fadeHover($(this), true);},
        function(){fadeHover($(this), false);}
    );

    $("#goodtea .next").hover(
        function(){fadeHover($(this), true);},
        function(){fadeHover($(this), false);}
    );

	
	
	/* GOODTIME */
	
	current_goodtime_banner = 0;
	goodtime_counter = $("#goodtime .navigation li").index();
	
	$('#goodtime .prev').click(function(){
        current_goodtime_banner  --;
		if (current_goodtime_banner  < 0) {
			current_goodtime_banner = goodtime_counter;
		}
        moveToCurrentBanner(current_goodtime_banner , '#goodtime ul.carousel_home' , 900, true);
    });
	
	$('#goodtime .next').click(function(){
        current_goodtime_banner  ++;	
		if (current_goodtime_banner > goodtime_counter) {
			current_goodtime_banner = 0;
		} 	
       moveToCurrentBanner(current_goodtime_banner , '#goodtime ul.carousel_home' , 900, true);

    });
	
	$('#goodtime .navigation li').click(function(){
		current_goodtime_banner = $(this).index();
        moveToCurrentBanner(current_goodtime_banner , '#goodtime ul.carousel_home' , 900, true);
    });
	
	$("#goodtime .navigation li").hover(
        function(){if(!$(this).hasClass('active')) fadeHover($(this), true);},
        function(){if(!$(this).hasClass('active')) fadeHover($(this), false);}
    );

	// initialize drink selection
	if (!$.browser.msie || $.browser.version >= 9) {
    	$('#drinkselection1 li, #drinkselection2 li, #drinkselection3 li').stop().animate({opacity:0.7},0);
	}
	
	$('.drinkname,.largecup').hide();
	
    $('#drinkselection1 li').hover(
		// when rollover drink selection 1
		
		function(){
		current_drink = $(this).index();	
   		$('#drinkselection1 li').each(function(){ 
           if($(this).index() != current_drink){
				//$(this).stop().animate({opacity:0.7},500);
				if (!$.browser.msie || $.browser.version >= 9) {
					$(this).stop().animate({opacity:0.7},500);
				} else $(this).show();
				$('div#goodtime_1_title').hide();
				$('#goodtime_1_description div.drinkname').eq($(this).index()).hide();
				$('#goodtime_1_image img.mainimage').hide();
		    } else {
				if (!$.browser.msie || $.browser.version >= 9) {
					$(this).stop().animate({opacity:1.0},500);
				} else $(this).show();
				$('.drinkname1 li').eq($(this).index()).stop(true, true).fadeIn(800);
				$('#goodtime_1_description div.drinkname').eq($(this).index()).stop(true, true).fadeIn(800);
				$('#goodtime_1_image img.largecup').eq($(this).index()).stop(true, true).fadeIn(800);
			}
        });
	},
		function(){
     	// when not hover
    	//$('#drinkselection1').stop().animate({opacity:0.7},0);
		if (!$.browser.msie || $.browser.version >= 9) {
				$('#drinkselection1').stop().animate({opacity:0.7},500);
		} else $(this).show();
		$('#goodtime_1_description div, #goodtime_1_image img').hide();
		$('#goodtime_1_title, #goodtime_1_image img:nth-child(1)').stop(true, true).fadeIn(800);
		}
	);
	
	 $('#drinkselection2 li').hover(
		// when rollover drink selection 1
		function(){
		current_drink = $(this).index();	
   		$('#drinkselection2 li').each(function(){ 
           if($(this).index() != current_drink){
				//$(this).stop().animate({opacity:0.7},500);
				if (!$.browser.msie || $.browser.version >= 9) {
					$(this).stop().animate({opacity:0.7},500);
				} else $(this).show();
				$('div#goodtime_2_title').hide();
				$('#goodtime_2_description div.drinkname').eq($(this).index()).hide();
				$('#goodtime_2_image img.mainimage').hide();
		    } else {
				if (!$.browser.msie || $.browser.version >= 9) {
					$(this).stop().animate({opacity:1.0},500);
				} else $(this).show();
				$('.drinkname2 li').eq($(this).index()).stop(true, true).fadeIn(800);
				$('#goodtime_2_description div.drinkname').eq($(this).index()).stop(true, true).fadeIn(800);
				$('#goodtime_2_image img.largecup').eq($(this).index()).stop(true, true).fadeIn(800);
			}
        });
	},
		function(){
     	// when not hover
    	if (!$.browser.msie || $.browser.version >= 9) {
				$('#drinkselection2').stop().animate({opacity:0.7},500);
		} else $(this).show();
		$('#goodtime_2_description div, #goodtime_2_image img').hide();
		$('#goodtime_2_title, #goodtime_2_image img:nth-child(1)').stop(true, true).fadeIn(800);
		}
	);
	
	$('#drinkselection3 li').hover(
		// when rollover drink selection 1
		function(){
		current_drink = $(this).index();	
   		$('#drinkselection3 li').each(function(){ 
           if($(this).index() != current_drink){
				if (!$.browser.msie || $.browser.version >= 9) {
					$(this).stop().animate({opacity:0.7},500);
				} else $(this).show();
				$('div#goodtime_3_title').hide();
				$('#goodtime_3_description div.drinkname').eq($(this).index()).hide();
				$('#goodtime_3_image img.mainimage').hide();
		    } else {
				if (!$.browser.msie || $.browser.version >= 9) {
					$(this).stop().animate({opacity:1.0},500);
				} else $(this).show();
				$('.drinkname3 li').eq($(this).index()).stop(true, true).fadeIn(800);
				$('#goodtime_3_description div.drinkname').eq($(this).index()).stop(true, true).fadeIn(800);
				$('#goodtime_3_image img.largecup').eq($(this).index()).stop(true, true).fadeIn(800);
			}
        });
	},
		function(){
     	// when not hover
    	if (!$.browser.msie || $.browser.version >= 9) {
				$('#drinkselection3').stop().animate({opacity:0.7},500);
		} else $(this).show();
		$('#goodtime_3_description div, #goodtime_3_image img').hide();
		$('#goodtime_3_title, #goodtime_3_image img:nth-child(1)').stop(true, true).fadeIn(800);
		}
	);
	
	$("#goodtime .prev").hover(
        function(){fadeHover($(this), true);},
        function(){fadeHover($(this), false);}
    );

    $("#goodtime .next").hover(
        function(){fadeHover($(this), true);},
        function(){fadeHover($(this), false);}
    );
	
	// LOCATIONS
	/*current_map = 0;
	
	
	$('#city li.location_btn').click(
		function(){
			//current_city = $(this).index();
			// alert(current_city);
			current_city = $('#city li.location_btn').index(this)
			// alert( $('#city li.location_btn').index(this) );
			
			//$("#counter").text("There are " + current_city);
			$('#city li').each(function(){
			if($('#city li.location_btn').index(this) != current_city){
				$('#locations #map li').eq($(this).index()).css({'display': 'none'});
				$('#locations #map li').eq(current_city).css({'display': 'block'});
				$('#city li').removeClass('active');
				$('#city li.location_btn').eq(current_city).addClass('active');
			}
			});
		}
	);	*/
	
	// google_map();
});

function moveToCurrentBanner(index, id, width, fadeContainer)
{
    animationComplete = false;

    var current = index;
    current_banner = current;
    var margin = (current * width)*-1;

    if(fadeContainer){
      $(id).find('.container').css('display', 'none');
    }

    $(id).stop().animate({marginTop:''+margin+'px'},{
        duration:100,
        complete: function(){
            if(fadeContainer){
               $(id).find('.container').fadeIn(500);
			   //$(id).find('.container').stop().animate({"left": "-50px"}, "slow");
			   }
            animationComplete = true;
        }
    });
	
	activeThis($("#news .navigation li").eq(current_news),'#news .navigation li');
    activeThis($("#goodtea .navigation li").eq(current_goodtea_banner),'#goodtea .navigation li');
	activeThis($("#goodtime .navigation li").eq(current_goodtime_banner),'#goodtime .navigation li');

}

function fadeHover(sel, fadein){
    if(!$(sel).hasClass('active')){
        if(fadein){
              $(sel).find('.normal').hide();
              $(sel).find('.hover').show();
        }else{
			$(sel).find('.normal').show();
            $(sel).find('.hover').hide();
        }
    }
}

function activeThis(sel, elem){
	$(elem).removeClass('active');
	$(sel).addClass('active');
	$(elem).each(function(){
		if(!$(this).hasClass('active')){
			$(this).find('.hover').stop(false,true).fadeOut(speed);
			$(sel).find('.normal').stop(false,true).fadeIn(speed);
		}
	})
}

function moveToPage(page){
    switch (page){
        case 'home':
            $("html, body").animate({ scrollTop: "0px" }, 800);
        break;
        case 'good_tea':
            $("html, body").animate({ scrollTop: "800px" }, 800);
        break;

        case 'good_time':
            $("html, body").animate({ scrollTop: "1750px" }, 800);
        break;

        case 'drink_menu':
            $("html, body").animate({ scrollTop: "2700px" }, 800);
        break;
		
		case 'rewards':
            $("html, body").animate({ scrollTop: "3975px" }, 800);
        break;
		
        case 'our_locations':
            $("html, body").animate({ scrollTop: "5050px" }, 800);
        break

        case 'talk_to_us':
            $("html, body").animate({ scrollTop: "5750px" }, 800);
        break;
    }
}


//function moveToPage(page){
	
  //  switch (page){
   //     case 'home':top=0;
     //   break;
	//	
    //    case 'good_tea':top=800;
   //     break;
	//	
    //    case 'good_time':top=1750;
    //    break;
	//	
     //   case 'drink_menu':top=2700;
    //    break;
	//	
    //    case 'our_locations':top=3975;
     //   break
//
     //   case 'talk_to_us':top=4650;
   //     break;
//    }
	//if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {           
    //  window.scrollTo(0,top);	
    		//$('body').append($('<div></div>').addClass('iosfix'));
           // setTimeout(function(){
             //     $('.iosfix').remove();
             //     },500);
             //     return false;
	//} else{
	//$("html, body").animate({ scrollTop: top }, 800);
	//}
    
			
//}



function pageOfPosition(position){
    switch(true){
        case ((position == 0) && (position < 600)):
          page = 'home';
          break;
        case ((position >= 600) && (position < 1400)):
          page = 'good_tea';
          break;
        case ((position >= 1400) && (position < 2400)):
          page = 'good_time';
          break;
        case ((position >= 2400) && (position < 3600)):
          page = 'drink_menu';
          break;
        case ((position >= 3600) && (position < 4500)):
          page = 'rewards';
          break;
		  case ((position >= 4600) && (position < 5500)):
          page = 'our_locations';
          break;
        case (position >= 5500):
          page = 'talk_to_us';
          break;
        default:
          page = 'home';
    }

    if(page != curr_page){
        curr_page = page;

        $('#header .home_menu1').each(function(){
            if($(this).attr('data-page') == page)
                activeThis($(this), '#header a');
        })
        
		window.location.assign('#'+page);
        }
		
	if(page == 'drink_menu'){
			$('#menu #tempback').css({'display': 'block'});
	} else {
		
		$('#menu #tempback').css({'display': 'none'});
	}
	
	if(page == 'rewards'){
			$('#rewards #tempback').css({'display': 'block'});
	} else {
		
		$('#rewards #tempback').css({'display': 'none'});
	}
}


function google_map() {
	  
        var map_canvas1 = $('#map_canvas_downtown')[0];
		var map_canvas2 = $('#map_canvas_northyork')[0];
		var map_canvas3 = $('#map_canvas_markham')[0];
		var map_canvas4 = $('#map_canvas_richmondhill')[0];
		var map_canvas5 = $('#map_canvas_pacmall')[0];
		var map_canvas6 = $('#map_canvas_waterloo')[0];
		var map_canvas7 = $('#map_canvas_mississauga')[0];
		var map_canvas8 = $('#map_canvas_annex_downtown')[0];
		var map_canvas9 = $('#map_canvas_scarborough_midland')[0];
		var map_canvas10 = $('#map_canvas_vaughan_rutherford')[0];
		var map_canvas11 = $('#map_canvas_willowdale')[0];
		
		
		var myLatlng1 = new google.maps.LatLng(43.65554, -79.38465);
		var myLatlng2 = new google.maps.LatLng(43.77809, -79.41518);
		var myLatlng3 = new google.maps.LatLng(43.823499, -79.327468);
		var myLatlng4 = new google.maps.LatLng(43.842505, -79.386752);
		var myLatlng5 = new google.maps.LatLng(43.825146, -79.305389);
		var myLatlng6 = new google.maps.LatLng(43.477099, -80.52569);
		var myLatlng7 = new google.maps.LatLng(43.578090, -79.652317);
		var myLatlng8 = new google.maps.LatLng(43.667292, -79.400775);
		var myLatlng9 = new google.maps.LatLng(43.806018, -79.287966);
		var myLatlng10 = new google.maps.LatLng(43.82854, -79.53815);
		var myLatlng11 = new google.maps.LatLng(43.791577, -79.367660);
		
        var map_options1 = {
          center: myLatlng1,
          zoom: 15,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map1 = new google.maps.Map(map_canvas1, map_options1)
		
		var marker1 = new google.maps.Marker({
      	position: myLatlng1,
      	map: map1
		});
		
		var map_options2 = {
          center: myLatlng2,
          zoom: 13,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map2 = new google.maps.Map(map_canvas2, map_options2)
		
		google.maps.event.trigger(map2, 'resize');
		
		var marker2 = new google.maps.Marker({
      	position: myLatlng2,
      	map: map2
		});
		
		var map_options3 = {
          center: myLatlng3,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map3 = new google.maps.Map(map_canvas3, map_options3)
		
		google.maps.event.trigger(map3, 'resize');
		
		var marker3 = new google.maps.Marker({
      	position: myLatlng3,
      	map: map3
		});
		
		var map_options4 = {
          center: myLatlng4,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map4 = new google.maps.Map(map_canvas4, map_options4)
		
		google.maps.event.trigger(map4, 'resize');
		
		var marker4 = new google.maps.Marker({
      	position: myLatlng4,
      	map: map4
		});
		
		var map_options5 = {
          center: myLatlng5,
          zoom: 15,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map5 = new google.maps.Map(map_canvas5, map_options5)
		
		google.maps.event.trigger(map5, 'resize');
		
		var marker5 = new google.maps.Marker({
      	position: myLatlng5,
      	map: map5
		});
		
		//
		
		var map_options6 = {
          center: myLatlng6,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map6 = new google.maps.Map(map_canvas6, map_options6)
		
		google.maps.event.trigger(map6, 'resize');
		
		var marker6 = new google.maps.Marker({
      	position: myLatlng6,
      	map: map6
		});
		
		var map_options7 = {
          center: myLatlng7,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map7 = new google.maps.Map(map_canvas7, map_options7)
		
		google.maps.event.trigger(map7, 'resize');
		
		var marker7 = new google.maps.Marker({
      	position: myLatlng7,
      	map: map7
		});
		
		var map_options8 = {
          center: myLatlng8,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map8 = new google.maps.Map(map_canvas8, map_options8)
		
		google.maps.event.trigger(map8, 'resize');
		
		var marker8 = new google.maps.Marker({
      	position: myLatlng8,
      	map: map8
		});
		
		var map_options9 = {
          center: myLatlng9,
          zoom: 13,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map9 = new google.maps.Map(map_canvas9, map_options9)
		
		google.maps.event.trigger(map9, 'resize');
		
		var marker9 = new google.maps.Marker({
      	position: myLatlng9,
      	map: map9
		});
		
		var map_options10 = {
          center: myLatlng10,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map10 = new google.maps.Map(map_canvas10, map_options10)
		
		google.maps.event.trigger(map10, 'resize');
		
		var marker10 = new google.maps.Marker({
      	position: myLatlng10,
      	map: map10
		});
		
		var map_options11 = {
          center: myLatlng11,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
		var map11 = new google.maps.Map(map_canvas11, map_options11)
		
		google.maps.event.trigger(map11, 'resize');
		
		var marker11 = new google.maps.Marker({
      	position: myLatlng11,
      	map: map11
		});
		

		
		// Refresh the map for those maps that are hidden to show the map properly
		
		
		
		
      }

/*
function google_map() {
	  
        var map_canvas1 = $('#map_canvas_downtown')[0];
		var map_canvas2 = $('#map_canvas_northyork')[0];
		var map_canvas3 = $('#map_canvas_markham')[0];
		var map_canvas4 = $('#map_canvas_richmondhill')[0];
		var map_canvas5 = $('#map_canvas_pacmall')[0];
		var map_canvas6 = $('#map_canvas_waterloo')[0];
		var map_canvas7 = $('#map_canvas_mississauga')[0];
		var map_canvas8 = $('#map_canvas_annex_downtown')[0];
		var map_canvas9 = $('#map_canvas_scarborough_midland')[0];
		var map_canvas10 = $('#map_canvas_vaughan_rutherford')[0];
		var map_canvas11 = $('#map_canvas_willowdale')[0];
		
		
		var myLatlng1 = new google.maps.LatLng(43.65554, -79.38465);
		var myLatlng2 = new google.maps.LatLng(43.77809, -79.41518);
		var myLatlng3 = new google.maps.LatLng(43.823499, -79.327468);
		var myLatlng4 = new google.maps.LatLng(43.842505, -79.386752);
		var myLatlng5 = new google.maps.LatLng(43.825146, -79.305389);
		var myLatlng6 = new google.maps.LatLng(43.477099, -80.52569);
		var myLatlng7 = new google.maps.LatLng(43.578090, -79.652317);
		var myLatlng8 = new google.maps.LatLng(43.667292, -79.400775);
		var myLatlng9 = new google.maps.LatLng(43.806018, -79.287966);
		var myLatlng10 = new google.maps.LatLng(43.82854, -79.53815);
		var myLatlng11 = new google.maps.LatLng(43.791577, -79.367660);
		
        var map_options1 = {
          center: myLatlng1,
          zoom: 15,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map1 = new google.maps.Map(map_canvas1, map_options1)
		
		var marker1 = new google.maps.Marker({
      	position: myLatlng1,
      	map: map1
		});
		
		var map_options2 = {
          center: myLatlng2,
          zoom: 13,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map2 = new google.maps.Map(map_canvas2, map_options2)
		
		google.maps.event.trigger(map2, 'resize');
		
		var marker2 = new google.maps.Marker({
      	position: myLatlng2,
      	map: map2
		});
		
		var map_options3 = {
          center: myLatlng3,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map3 = new google.maps.Map(map_canvas3, map_options3)
		
		google.maps.event.trigger(map3, 'resize');
		
		var marker3 = new google.maps.Marker({
      	position: myLatlng3,
      	map: map3
		});
		
		var map_options4 = {
          center: myLatlng4,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map4 = new google.maps.Map(map_canvas4, map_options4)
		
		google.maps.event.trigger(map4, 'resize');
		
		var marker4 = new google.maps.Marker({
      	position: myLatlng4,
      	map: map4
		});
		
		var map_options5 = {
          center: myLatlng5,
          zoom: 15,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map5 = new google.maps.Map(map_canvas5, map_options5)
		
		google.maps.event.trigger(map5, 'resize');
		
		var marker5 = new google.maps.Marker({
      	position: myLatlng5,
      	map: map5
		});
		
		//
		
		var map_options6 = {
          center: myLatlng6,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map6 = new google.maps.Map(map_canvas6, map_options6)
		
		google.maps.event.trigger(map6, 'resize');
		
		var marker6 = new google.maps.Marker({
      	position: myLatlng6,
      	map: map6
		});
		
		var map_options7 = {
          center: myLatlng7,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map7 = new google.maps.Map(map_canvas7, map_options7)
		
		google.maps.event.trigger(map7, 'resize');
		
		var marker7 = new google.maps.Marker({
      	position: myLatlng7,
      	map: map7
		});
		
		var map_options8 = {
          center: myLatlng8,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map8 = new google.maps.Map(map_canvas8, map_options8)
		
		google.maps.event.trigger(map8, 'resize');
		
		var marker8 = new google.maps.Marker({
      	position: myLatlng8,
      	map: map8
		});
		
		var map_options9 = {
          center: myLatlng9,
          zoom: 13,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map9 = new google.maps.Map(map_canvas9, map_options9)
		
		google.maps.event.trigger(map9, 'resize');
		
		var marker9 = new google.maps.Marker({
      	position: myLatlng9,
      	map: map9
		});
		
		var map_options10 = {
          center: myLatlng10,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        var map10 = new google.maps.Map(map_canvas10, map_options10)
		
		google.maps.event.trigger(map10, 'resize');
		
		var marker10 = new google.maps.Marker({
      	position: myLatlng10,
      	map: map10
		});
		
		var map_options11 = {
          center: myLatlng11,
          zoom: 14,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
		var map11 = new google.maps.Map(map_canvas11, map_options11)
		
		google.maps.event.trigger(map11, 'resize');
		
		var marker11 = new google.maps.Marker({
      	position: myLatlng11,
      	map: map11
		});
		

		
		// Refresh the map for those maps that are hidden to show the map properly
		
		
		
		
      }


*/


