
console.log("begin");

var Calculator = function(calculatorDiv){
    var calculator = $(calculatorDiv);
    this.inputCommand = $(calculator).find(".inputCommand");
    this.submitButton = $(calculator).find(".submitButton");
    this.resultHistory = $(calculator).find(".resultHistory");
    this.observers=$({});
    this.initialize();
}

Calculator.prototype={
    initialize:function(){
        this.callCreate();
        this.observeButtonClick();
    },

    observeButtonClick:function(){
        this.submitButton.click(_.bind(this.callUpdate, this));
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
            this.resultHistory.append("<h4>Calculator created</h4>");
            this.calculatorCreated = true;
        }
        else if(xhr.status == 200){
            this.resultHistory.append("<h4>Calculator found</h4>");
            this.calculatorCreated = true;
        }
    },

    callUpdate:function(){
      var self = this;
      if(!self.updateCalculator) {
          self.callCreate();
      }
      else {
          self.updateCalculator();
      }
    },

    updateCalculator:function(){
        var self = this;
        $.ajax({
            type: "PUT",
            url: "http://localhost:3000/api/calculator",
            data: {command : self.inputCommand.val()},
            success: function (result) {
                self.appendToHistory(self.inputCommand.val(),result.state);
                self.notifyObservers(self.inputCommand.val(),result.state);
            }
        });
    },

    appendToHistory:function(command,result){
        this.resultHistory.append("<h4>The output for input command <i>"+command +"</i> is: </h4>"+result+"<br><hr>");
    },
    notifyObservers: function(command,resultState) {
        this.observers.trigger("calculator:updated",[command,resultState]);
    },
    registerObserver : function(observer) {
        this.observers.on("calculator:updated",_.bind(observer.handleUpdateEvent, observer));
    },
    handleUpdateEvent:function(event,command,resultState) {
        this.appendToHistory(command, resultState);
    }
}

$(document).ready(function() {
    var  calculator1 = new Calculator("#calculatorDiv");
    var  calculator2 = new Calculator("#calculatorDiv2");
    var  calculator3 = new Calculator("#calculatorDiv3");
    calculator1.registerObserver(calculator2);
    calculator1.registerObserver(calculator3);

    calculator2.registerObserver(calculator1);
    calculator2.registerObserver(calculator3);

    calculator3.registerObserver(calculator1);
    calculator3.registerObserver(calculator2);
});