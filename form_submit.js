jQuery(function($) {

  $("#nameSubmit").validator().on('submit', function(e) {

    //store email value in var
    var email = $('#entry_143753257').val();
    // store google Url from post
    var googleUrl = $('#gform_url').val();

    // if form invalid
    if (e.isDefaultPrevented()) {
      // handle the invalid form

    } else {
      // everything checks out
      e.preventDefault();

          // send facebook lead pixel
          fbq('track', 'Lead');

          // send NameAcq conversion to google
          ga("send","pageview","/GOALS/NameAcquisition");

      //  MEMBER CHECK -- send ajax call to mailchimp api to check if user is a member
      $.ajax({
        type: "POST",
        url: "https://tshaonline.org/_ajax/mailchimp-api/mailchimp.api.php",
        data: {operation: 'list-status', list: 'member', email: email },

        //if post is successful show me the response data
        success: function(responseData){

          //store response data in a variable 
          var response = responseData;
          var memberStatus = response.results['member-list'];

          // USER IS MEMBER

          if(memberStatus) {

          	// SEND USER TO  GOOGLE AND EMAIL EBOOK
          	$.ajax({
		        type: "POST",
		        url: googleUrl,
		        data: $("#nameSubmit").serialize(),
		      }); 
           
            console.log("Go to Donate Page");

           window.location.href = "https://tshaonline.org/ebook_lander/donate/"

          } else {

            // USER IS NOT A MEMBER

            // MAILCHIMP -- add to conversion series

            $.ajax({
              type: "POST",
              url: "https://tshaonline.org/_ajax/mailchimp-api/mailchimp.api.php",
              data: {operation: 'add-to-list', list: 'conversion-series', email: email},
              success: function(responseData) {

		      // CHECK IF USER IN DB --  

		      $.ajax({
		        url: ajaxurl,
		        type:'POST',
		        data:{
		          action: 'submit_lead',
		          email: email,
		        },
		        success: function(response){
		          	
		          	if(response == 'user_exist') {
		          		
		          		// send user to memberpage

                  alert("You are only allowed one free download. Become a TSHA Member for unlimited Access to History Resources!");
                  window.location.href = "https://tshaonline.org/ebook_lander/membership/"

		          	}
		          	else {

					      // SEND USER TO  GOOGLE AND EMAIL EBOOK

					      $.ajax({
					        type: "POST",
					        url: googleUrl,
					        data: $("#nameSubmit").serialize(),
					      }); 

                window.location.href = "https://tshaonline.org/ebook_lander/thank-you/"

					  }
					}
				}); // END DB USER CHECk

              },
              error: function(responseData) {
                // handle error
              }
            })

          }

        },
        error: function(responseData) {
          alert("Something went wrong. Please try again.")
        }
      }); // END MEMBER CHECK


    } // end else

  });
});