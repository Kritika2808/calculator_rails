
console.log("begin");

var Calculator = function(templateId){

    var calculator = $(templateId).find(".calculator").clone().appendTo( ".baseDiv" );

    this.inputCommand = $(calculator).find(".inputCommand");
    this.submitButton = $(calculator).find(".submitButton");
    this.resultHistory = $(calculator).find(".resultHistory");
    this.observers=$({});
    this.initialize();
};

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
        }).success(_.bind(self.handleCallCreate,self));
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
};

var Calculators = function(addButtonId){
    this.calculatorList = [];
    this.addCalculatorButton = $(addButtonId);
    this.initialize();
};

Calculators.prototype = {
    initialize:function(){
        this.addCalculator();
    },
    addCalculator:function(){
        this.addCalculatorButton.click(_.bind(this.add, this));
    },
    add:function(){
        var newCalculator=new Calculator('#template');
            for(var i=0;i<this.calculatorList.length;i+=1)
            {
                this.calculatorList[i].registerObserver(newCalculator);
                newCalculator.registerObserver(this.calculatorList[i]);
            }
        this.calculatorList.push(newCalculator);
    }
};

$(document).ready(function() {

     new Calculators("#addCalculatorButton");

});