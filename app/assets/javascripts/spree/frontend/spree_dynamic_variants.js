// the installer will append this file to the app vendored assets here: vendor/assets/javascripts/spree/frontend/all.js'
$(document).ready(function() {

  var VariantSelectWidget = {
    elements: {
      optionsForm: $('#inside-product-cart-form'),
      optionsDropdowns: $('#inside-product-cart-form').find('select'),
      price: $("#price")
    },
    product: gon.product,

    init: function() {
      // only continue init if a product has been supplied from the controller
      if (this.product == undefined) return

      this.bindUIActions()
      // simulate a variant change to make sure everything is up to date on init
      this.handleVariantChange()
    },

    bindUIActions: function() {
      this.elements.optionsDropdowns.change(function() {
        VariantSelectWidget.handleVariantChange()
      })
    },

    // --------------
    // ui handlers
    // --------------

    handleVariantChange: function() {
      var price = this.newPrice(this.currentVariant())
      this.elements.price.html('$' + parseInt(price.amount) + ' ' + price.currency)
    },

    // --------------
    // helper handlers
    // --------------

    // returns a new price object by summing the surcharge fields on the option variants
    newPrice: function(variant) {
      return this.product.prices.find(function(variantPrice) {
        return variantPrice.variant_id == variant.id
      })
    },

    // returns a json object representing the selected option values in the UI
    selectedOptionValues: function() {
      var option_values = {}

      $.each(this.elements.optionsDropdowns, function(i, dropdown) {
        var id = $(dropdown).attr('id')
        if (!id.startsWith('options_')) return
        option_values[id.replace('options_', '')] = $(dropdown).val()
      })

      return option_values
    },

    // map option_type_id => id for a given set of options
    mappedOptions: function(options) {
      var option_values = {}

      $.each(options, function(i, option) {
        option_values[option.option_type_id] = option.id.toString()
      })

      return option_values
    },

    // returns the currently selected variant object or undefined if one cannot be found
    // looks through the variants and compares mapped options to the values selected in the UI
    currentVariant: function() {
      var selectedValues = this.selectedOptionValues()
      return this.product.variants.find(function(variant) {
        var mappedOptions = VariantSelectWidget.mappedOptions(variant.option_values)
        return JSON.stringify(mappedOptions) === JSON.stringify(selectedValues)
      })
    }
  }

  VariantSelectWidget.init()
})
