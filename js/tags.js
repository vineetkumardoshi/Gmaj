var blocklist = [];
$(function(){

  $('#tags input').on('focusout',function(){    
    var txt= (this.value.replace(/[^a-zA-Z0-9\+\-\.\#\@\$\%\s\,"]/g,'')).trim(); // allowed characters
    if(txt) {
      $(this).before('<span class="tag hvr-icon-fade hvr-grow fa-times">'+ txt +'</span>');
      blocklist.push(txt);
    }
    this.value="";
  }).on('keyup',function( e ){
    // if: comma,enter (delimit more keyCodes with | pipe)
    if(/(13)/.test(e.which)) {
      $(this).focusout(); 
      
    }
  });
  
  
  $('#tags').on('click','.tag',function(){
     
      $(this).remove();
      var index = blocklist.indexOf(this.innerText); 
      if (index > -1) {
          blocklist.splice(index, 1);
      }
  });  
          

});

