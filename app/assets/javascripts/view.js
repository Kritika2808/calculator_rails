
console.log("begin");

var Calculator = function(calculatorDiv){
    var calculator = $("#"+calculatorDiv);
    this.inputCommand = $(calculator).find(".inputCommand");
    this.submitButton = $(calculator).find(".submitButton");
    this.resultHistory = $(calculator).find(".resultHistory");
    this.calculatorState = false;
    this.observers=$({});
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
                self.appendToHistory(self.inputCommand.val(),result.state);
                self.state = result.state;
                self.notifyObservers(self.inputCommand.val(),result.state);
            },
            error: function(){
                console.log("error");
            }
        });
    },
    appendToHistory:function(command,result){
        $(this.resultHistory).append("<h4>The output for input command <i>"+command +"</i> is: </h4>"+result+"<br><hr>");
    },
    notifyObservers: function(command,resultState) {
        this.observers.trigger("calculator:updated",[command,resultState]);
    },
    registerObserver : function(observer) {
        var self = this;
        this.observers.on("calculator:updated", function(event,command,resultState) {

            observer.appendToHistory(command, resultState);
        });

    }
}

$(document).ready(function() {
    var  calculator1 = new Calculator("calculatorDiv");
    var  calculator2 = new Calculator("calculatorDiv2");
    var  calculator3 = new Calculator("calculatorDiv3");
    calculator1.registerObserver(calculator2);
    calculator1.registerObserver(calculator3);

    calculator2.registerObserver(calculator1);
    calculator2.registerObserver(calculator3);

    calculator3.registerObserver(calculator1);
    calculator3.registerObserver(calculator2);
});