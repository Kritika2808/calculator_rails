
console.log("begin");

$(document).ready(function() {
    $("#button").click(function () {
        var inputCommand = $("#command").val();
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/calculator",
            data: inputCommand,
	    cache:false,
            dataType: "json",
            crossDomain: true,
	    Access-Control-Request-Headers: x-requested-with,
            success: function (result) {
		console.log("success");
                console.log(result);
            },
            error: function(){
                console.log("error");
            }

        });
    });
});
