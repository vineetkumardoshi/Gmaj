$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    
    $('[id="check1"]').click(function () {
    	$('[id="tags"').slideToggle(300);
    }); 

	$('[id="check2"]').click(function () {
    	$('[id="max-lines"').slideToggle(300);
        $('[id="countblines"').slideToggle(300);
        $('[id="yes"').slideToggle(300);
        $('[id="no"').slideToggle(300);
        $('[id="qmark2"').slideToggle(300);
    }); 

 
});




