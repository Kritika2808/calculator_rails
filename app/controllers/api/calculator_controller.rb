module Api
	class CalculatorController < ApplicationController 
		protect_from_forgery
		def update
		  calculator=Calculator.first || Calculator.create({:state => 0})
		  if calculator
			command=params[:command]
			parser = Parser.new(command)
			router = Router.new(calculator)
			result=router.map(parser)
	        render :json=> {:state => calculator.state }
	      else
	    	head :not_found
	      end
		end

	
	    def create
	    	calculator = Calculator.first || Calculator.create({:state => 0})
	    	#head :created

        redirect_to '/api/calculator', method: :put
        #redirect_to :action => 'update'

         #redirect_to api_calculator_update_path(@calculator)
        # respond_to do |format|
        #   format.html { redirect_to api_calculator_update_path(@calculator), notice: 'You are logged in' }
        #
        # end


        # flash[:notice] = "Thanks for your review!"
        # respond_to do |format|
        #   format.html { redirect_to api_calculator_url, :action => "update"}
        #   format.js
        #   end
	    end
	end
end