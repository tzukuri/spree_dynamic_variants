Spree::ProductsController.class_eval do

  before_action :inject_product, only: :show

  private

  # inject the current product along with variants and option values into javascript
  def inject_product
    gon.product = JSON.parse(@product.to_json(:include => [{ :variants => { :include => :option_values }}, :prices, { :option_types => { :include => :option_values }}]))
  end

end
