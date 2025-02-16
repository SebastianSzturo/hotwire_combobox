class NewOptionsFormsController < ApplicationController
  def create
    if User.create user_params
      redirect_to new_options_combobox_path, notice: "User created"
    else
      head :unprocessable_entity
    end
  end

  private
    def user_params
      params
        .require(:user)
        .permit(
          :favorite_state_id,
          :home_state_id,
          favorite_state_attributes: [:name],
          home_state_attributes: [:name])
    end
end
