
console.log("begin");

var Calculator = function(calculatorDiv){
    var calculator = $("#"+calculatorDiv);
    this.inputCommand = $(calculator).find(".inputCommand");
    this.submitButton = $(calculator).find(".submitButton");
    this.resultHistory = $(calculator).find(".resultHistory");

    this.initialize();
}

Calculator.prototype={
    initialize:function(){
        this.observeButtonClick();
    },
    observeButtonClick:function(){
        this.submitButton.click(_.bind(this.createCalculator, this));
    },
    createCalculator:function(){
        if(this.calculatorState != "created"){
            this.callCreate();
        }
        this.callUpdate();
    },
    callCreate:function(){
        var self=this;
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/calculator"
        }).success(_.bind(self.handleCallCreate,self))
    },
    handleCallCreate:function(result,statusText,xhr){
        if (xhr.status == 201)
        {
            $(self.resultHistory).append("<h4>Calculator created</h4>");
            self.calculatorState = "created";
        }
        else if(xhr.status == 200){
            $(self.resultHistory).append("<h4>Calculator found</h4>");
            self.calculatorState = "created";
        }
    },
    callUpdate:function(){
        var self = this;
        $.ajax({
            type: "PUT",
            url: "http://localhost:3000/api/calculator",
            data: {command : self.inputCommand.val()},
            success: function (result) {
                $(self.resultHistory).append("<h4>The output for input command <i>"+self.inputCommand.val() +"</i> is: </h4>"+result.state+"<br><hr>");
                $("#result:even").css("background-color","darkcyan");
                $("#result:odd").css("background-color","blue");
            },
            error: function(){
                console.log("error");
            }
        });
    }

}

$(document).ready(function() {
   var  calculator1 = new Calculator("calculatorDiv");
   var  calculator2 = new Calculator("calculatorDiv2");
});