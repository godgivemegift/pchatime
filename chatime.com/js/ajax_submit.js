$(document).ready(function() {
	
	//if submit button is clicked
	$('#submit').click(function () {		
		
		$('#name_response, #email_response').text('');
		
		//Get the data from all the fields
		var name = $('input[name=name]');
		var email = $('input[name=email]');
		var phone = $('input[name=phone]');
		var comment = $('textarea[name=comment]');
		var inquiry = $('#inquiry');
		var honeypot = $('#robottest').val();

		//Simple validation to make sure user entered something
		//If error found, add hightlight class to the text field
		
		
		if (name.val()=='' || name.val().length <= 2) {
			$('#name_response').text('Your name is required');
			return false;
		} else $('#name_response').text('');
		
		if (!email.val().match(/^([a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4}$)/i)) {
			$('#email_response').text('A valid email is required');
			return false;
		} else $('#email_response').text('');
		
		if (honeypot != 'http://') {
            $('#name_response').text('Spambots are not allowed');  
			return false;  
        }
		
		//organize the data properly
		var data = 'name=' + name.val() + '&email=' + email.val() + '&phone=' + phone.val() + '&inquiry=' + inquiry.val() + '&comment='  + encodeURIComponent(comment.val());
		
		//disabled all the text fields
		$('.text').attr('disabled','true');
		
		//show the loading sign
		$('.loading').show();
		
		//start the ajax
		$.ajax({
			//this is the php file that processes the data and send mail
			url: "./process.php",	
			
			//GET method is used
			type: "GET",

			//pass the data			
			data: data,		
			
			//Do not cache the page
			cache: false,
			
			//success
			success: function (html) {				
				//if process.php returned 1/true (send mail success)
				if (html==1) {					
					//hide the form
					$('.form').fadeOut('slow');					
					
					//show the success message
					$('.done').fadeIn('slow');
					
				//if process.php returned 0/false (send mail failed)
				} else alert('Sorry, unexpected error. Please try again later.');				
			}		
		});
		
		//cancel the submit button default behaviours
		return false;
	});	
});