
console.log("begin");
//function calculate()
//{
//    console.log("Button click");
//    var inputCommand = document.getElementById("command").value;
//    alert(inputCommand);
//}

$(document).ready(function() {
    $("#button").click(function () {
//        $(this).hide();
        var inputCommand = $("#command").val();
        alert(inputCommand);
        $.ajax({
            type: "POST",
            url: "api/calculator",
            data: inputCommand,
            success: function (result) {
                console.log(result)
            },
            error: function(){
                console.log("error");
            }

        });
    });
});