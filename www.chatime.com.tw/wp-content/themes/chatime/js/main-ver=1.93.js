jQuery(document).ready(function($){
	
	// Add js class
	$('html').removeClass( 'no-js' ).addClass( 'js' );
	
	
	// HEADER
	// -----------------------------
	$('.headerrow__social__toggle').on( 'click', function(e){
		$(this).closest( '.headerrow__social' ).toggleClass( 'headerrow__social--open' );
		e.preventDefault();
	});
	$('.headerrow__links__language').on( 'click', function(e){
		$('body').removeClass( 'navpanels--open' ).toggleClass( 'countryselector--open' );
		e.preventDefault();
	});
	$('.headerrow__links__nav').on( 'click', function(e){
		$('body').removeClass( 'countryselector--open' ).toggleClass( 'navpanels--open' );
		e.preventDefault();
	});
	
	
	// BLOCKS - Carousel
	// ------------------------------
	$('.carousel').each(function(){
		
		// Init vars
		var $this = $(this);
		var prev = $this.find( '.carousel__prev' );
		var next = $this.find( '.carousel__next' );
		var prev2 = $this.find( '.carousel__prev2' );
		var next2 = $this.find( '.carousel__next2' );
		
		var prevIcon = prev.html();
		var nextIcon = next.html();
		var timer;
		var sliderAPI = $this.slideshow({
			slides:				'.carousel__slide',
			speed:				500,
			timer:				10000,
			autoplay:			false,
			keyboard:			true,
			pauseOnFocus:		true,
			loop:				true,
			useTouch:			false,
			controlsPrev:		prev,
			controlsNext:		next,
		}).data( 'slideshow' );
		prev.find( 'a' ).html( prevIcon );
		next.find( 'a' ).html( nextIcon );
		
		// Trigger slide change events
		$this.on( 'slideshowchangestart', function(){
			$this.removeClass( 'nottransitioning' );
			sliderAPI.slides.removeClass( 'slidingin slidingout current next previous' );
			sliderAPI.slides.eq( sliderAPI.data.current ).addClass( 'slidingin current' );
			sliderAPI.slides.eq( sliderAPI.data.previous ).addClass( 'slidingout' );
			sliderAPI.slides.eq( sliderAPI.restrictNumber( sliderAPI.data.current + 1 ) ).addClass( 'next' );
			sliderAPI.slides.eq( sliderAPI.restrictNumber( sliderAPI.data.current - 1 ) ).addClass( 'previous' );
			
			prev.add( next ).trigger( 'blur' );
		}).trigger( 'slideshowchangestart' );
		$this.on( 'slideshowchangeend', function(){
			sliderAPI.slides.removeClass( 'slidingin slidingout' );
			
			clearTimeout( timer );
			timer = setTimeout( function(){ $this.addClass( 'nottransitioning' ); }, 200 );
		}).trigger( 'slideshowchangeend' );
		
		// Trigger hover events
		prev.add( prev2 ).on( 'mouseenter', function(){
			$this.addClass( 'carousel--hoverprev' );
		}).on( 'mouseleave', function(){
			$this.removeClass( 'carousel--hoverprev' );
		});
		next.add( next2 ).on( 'mouseenter', function(){
			$this.addClass( 'carousel--hovernext' );
		}).on( 'mouseleave', function(){
			$this.removeClass( 'carousel--hovernext' );
		});
		
		// Trigger click
		prev2.on( 'click', sliderAPI.showPrevious );
		next2.on( 'click', sliderAPI.showNext );
		
	});
	
	
	// BLOCK - Locations form
	// ------------------------------
	$('.togglesubmitbutton').each(function(){
		var inputs = $(this).find( 'input' );
		var button = $(this).find( 'button' );
		var toggleButton = function(){
			var showButton = false;
			inputs.each(function(){
				if( $.trim( $(this).val() ) != '' ) {
					showButton = true;
				}
			});
			if( showButton ) {
				button.removeClass( 'disabled' ).prop( 'disabled', false );
			} else {
				button.addClass( 'disabled' ).prop( 'disabled', true );
			}
		};
		inputs.on( 'change keydown keyup', toggleButton );
		toggleButton();
	});
	
	
	// BLOCK - Quotes carousel
	// ------------------------------
	$('.quotescarousel').each(function(){
		var prev = $(this).find( '.carousel__prev' );
		var next = $(this).find( '.carousel__next' );
		var prevIcon = prev.html();
		var nextIcon = next.html();
		$(this).coolslider({
			type:				'scroll',
			slides:				'.quotescarousel__slide',
			speed:				500,
			timer:				10000,
			autoplay:			true,
			keyboard:			true,
			pauseOnFocus:		true,
			loop:				false,
			useTouch:			true,
			controlsPrev:		prev,
			controlsNext:		next,
		});
		prev.find( 'a' ).html( prevIcon );
		next.find( 'a' ).html( nextIcon );
	});
	
	
	// NEWS SECTION
	// ------------------------------
	$('.blogitems__content').matchSize();
	
	
	// DRINKS MENU
	// ------------------------------
	$('.drinksslider').each(function(){
		$(this).coolslider({
			type:				'fade',
			slides:				'.drinksslider__item',
			speed:				500,
			timer:				10000,
			autoplay:			true,
			keyboard:			true,
			pauseOnFocus:		true,
			loop:				false,
			useTouch:			false,
		});
	});
	$('.drinkdetails__toggle').each(function(){
		
		// Init vars
		var heading = $(this);
		var content = heading.next( '.drinkdetails__togglecontent' );
		var headingText = heading.html();
		var headingLink = $('<a href="#" class="drinkdetails__togglelink">');
		
		// Init functions
		var showContent = function(){
			headingLink.html( headingText+' -' );
			content.stop( true ).slideDown();
		};
		var hideContent = function(){
			headingLink.html( headingText+' +' );
			content.stop( true ).slideUp();
		};
		
		// Add link
		if( content.length ) {
			heading.empty().append( headingLink );
			headingLink.on( 'click', function(e){
				if( content.is( ':visible' ) ) {
					hideContent();
				} else {
					showContent();
				}
				e.preventDefault();
			});
			hideContent();
		}
		
	});
	$('.drinkscategories__toggle').on( 'click', function(e){
		$(this).closest( '.drinkscategories' ).toggleClass( 'drinkscategories--closed' );
		e.preventDefault();
	}).trigger( 'click' );
	
	
	// STAFF MEMBERS
	// ------------------------------
	$('.staff__grid').masonry({
		itemSelector: '.staff__box',
		columnWidth: '.staff__standard',
		percentPosition: true,
	});
	
	
	// DRINKS MENU - Category navigation
	// ------------------------------
	$('body.post-type-archive-drink, body.single-drink').find( '.drinkscategories' ).each(function(){
		
		// Init vars
		var drinks = $('.drinkslist li');
		var navLinks = $(this).find( 'ul a' );
		var navLinksFilter = navLinks.filter( '[data-drinkcat]' );
		var navLinksReset = navLinks.not( navLinksFilter );
		
		// Init functions
		var resetCategories = function() {
			drinks.show( 500, function(){ $(this).attr( 'style', '' ) } );
			navLinksFilter.parent( 'li' ).removeClass( 'current-menu-item' );
			navLinksReset.parent( 'li' ).addClass( 'current-menu-item' );
		}
		var pickCategory = function( catId ) {
			drinks.hide( 500 );
			drinks.filter( '.dcat-'+catId ).stop( true ).show( 500, function(){ $(this).attr( 'style', '' ) } );
			navLinks.parent( 'li' ).removeClass( 'current-menu-item' );
			navLinks.filter( '[data-drinkcat="'+catId+'"]' ).parent( 'li' ).addClass( 'current-menu-item' );
		}
		
		// Bind events
		navLinksReset.on( 'click', function(e){
			resetCategories();
			e.preventDefault();
		});
		navLinksFilter.on( 'click', function(e){
			pickCategory( $(this).data( 'drinkcat' ) );
			e.preventDefault();
		});
		
	});

	// Form Highlights
	// ------------------------------
	function getTextWidth(text, font) {
	    // if given, use cached canvas for better performance
	    // else, create new canvas
	    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	    var context = canvas.getContext("2d");
	    context.font = font;
	    var metrics = context.measureText(text);
	    return metrics.width;
	};

	function nospaces(t){
	  if(t.value.match(/\s/g)){
	    t.value=t.value.replace(/\s/g,'');
	  }
	}

	// Form Field Highlight
	// ------------------------------
	$('body').on('input', '.input__highlight__field', function(){
		var highlight = $(this).siblings('span');
		var type = this.type;
		var elem = this;
		var input = this.value;
		var font = window.getComputedStyle(elem, null).getPropertyValue('font-family');
		var fontSize = window.getComputedStyle(elem, null).getPropertyValue('font-size');
		var fontWeight = window.getComputedStyle(elem, null).getPropertyValue('font-weight');
		var final_font = fontWeight + ' ' + fontSize + ' ' + font;
		var textWidth = getTextWidth(input, final_font);
	    $(highlight).width(textWidth);
	});

	$('body').on('input', '.input__highlight__field', function(){
		var type = this.type;
		if(type == 'email'){
			$(this).val(function(_, v){
				return v.replace(/\s+/g, '');
			})
		}
	});


	// Form Field Highlight for Visual Form Builder
	// ------------------------------

	$('.vfb-item-text input[type="text"]').each(function(){
		$(this).addClass('input__highlight__field').wrap('<div class="input__highlight__container"></div>').after('<span class="input__highlight input__highlight__leaf"></span>');
	});
	$('.vfb-item-email input[type="email"]').each(function(){
		$(this).addClass('input__highlight__field').wrap('<div class="input__highlight__container"></div>').after('<span class="input__highlight input__highlight__leaf"></span>');
	});
	$('.vfb-item-phone input[type="tel"]').each(function(){
		$(this).addClass('input__highlight__field').wrap('<div class="input__highlight__container"></div>').after('<span class="input__highlight input__highlight__leaf"></span>');
	});
	
});
