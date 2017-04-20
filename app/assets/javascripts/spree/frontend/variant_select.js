$(document).ready(function() {

  var VariantSelectWidget = {
    elements: {
      optionsForm: $('#inside-product-cart-form'),
      optionsDropdowns: $('#inside-product-cart-form').find('select'),
      price: $("#price")
    },
    product: gon.product,
    basePrice: 0,
    baseCurrency: '',

    init: function() {
      this.bindUIActions()

      // set the base price and currency
      var priceVal = this.elements.price.html().split(' ')
      this.basePrice = parseFloat(priceVal[0].replace('$', ''))
      this.baseCurrency = priceVal[1]

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
      this.elements.price.html('$' + this.newPrice(this.currentVariant()) + ' ' + this.baseCurrency)
    },

    // --------------
    // helper handlers
    // --------------

    // returns a new price by summing the surcharge fields on the option variants
    newPrice: function(variant) {
      var surchargeTotal = 0
      $.each(variant.option_values, function(i, option) {
        if (option.surcharge) surchargeTotal += parseFloat(option.surcharge)
      })
      return this.basePrice + surchargeTotal
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
