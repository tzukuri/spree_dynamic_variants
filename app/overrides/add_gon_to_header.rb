Deface::Override.new(
  name: 'admin_product_dynamic_variants',
  virtual_path: 'spree/layouts/spree_application',
  insert_top: '[data-hook="inside_head"]',
  text:'<%= Gon::Base.render_data %>')
