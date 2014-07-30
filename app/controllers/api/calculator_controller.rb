module Api
	class CalculatorController < ApiController
  # respond_to :json
		def update
      if current_user
        calculator = current_user.calculator
        if calculator
          command=params[:command]
          parser = Parser.new(command)
          router = Router.new(calculator)
          result=router.map(parser)
          render :json=> {:state => calculator.state }
        else
          head :not_found
        end
      else
        head 401
      end

		end

	  def create
      if current_user
        if(current_user.calculator)
          head :ok
        else
          Calculator.create({:state => 0,:user_id => current_user.id})
          head :created
        end
      else
        head 401
      end

    end

  end
end