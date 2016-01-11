define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'Vm',
	'events',
	'views/products/structured_products/offering_list_item',
	'views/products/structured_products/sp_product_viewer',
	'text!templates/products/structured_products/product_list.html',
	'thirdparty/isotope.pkgd',
	'models/authed_user',
	'amd/handlebars/handlebars.helpers'
], function ($, _, Backbone, Handlebars, Vm, Events, OfferingListItem, SpProductViewer, Template, Isotope, AuthUser) {
	var ProductList = Backbone.View.extend({
		template: Handlebars.compile(Template),
		defaults: {
			sortable: true,
			selectable: true,
			canTransact: false
		},
		className: 'product-list',
		initialize: function() {
			this.options = $.extend(this.defaults, this.options);
			this.listenTo(this.collection, 'activeProductChange', this.showOfferingModal);
		},
		render: function() {
			var context = {
				filters: this.collection.getCategories(),
				user: AuthUser.toJSON()
			};
			this.$el.html(this.template(context));
			// render each model into its own view
			this.collection.each(function(model) {
				var view = Vm.create(this, 'OfferingView' + model.id, OfferingListItem, {model: model});
				this.$('.open-arch-list').append(view.$el);
			}, this);
			
			this.initIsotope();
			if (!this.collection.activeProduct) {
				this.$('.open-arch-list-filters li').first().click();
			}
		},
		initIsotope: function() {
			this.isotope = new Isotope(this.$('.open-arch-list')[0], {
				itemSelector: '.offering'
			});
			this.isotope.on('layoutComplete', _.bind(this.onLayoutComplete, this));
			return this.isotope;
		},
		events: {
			'click .open-arch-list-filters li': 'onFilterClick',
			'click .pricing-tool' : 'showPricingTool'
		},
		showPricingTool : function(e) {
			try{
				ga('send', 'event', 'pricing-tool', 'clicked');
			}catch(e){

			}
			new Alert("<font size='3'>You are now leaving the CAIS website. As CAIS' policies including its security and privacy policies, may not apply to the external website, please review the polices of the linked website. The external website is provided for your convenience and informational purposes only. CAIS is not an agent for this third party and neither endorses the information, content, presentation, or accuracy, nor makes any warranty, express or implied, regarding the external site. Please note the pricing terms offered on the linked website are not an offer to sell or buy securities.<br/><br/>Click, <b>NO</b> to return to CAIS website. </font>", 'Yes', 'No');
			$(document).bind("alertConfirm", function() {
				try{
					ga('send', 'event', 'pricing-tool', 'opened');
				}catch(e){
					
				}
				window.open('https://smart.caisgroup.bnpparibas.com');
			});
		},
		onLayoutComplete: _.debounce(function() {
			var category = this.$('.open-arch-list-filters li.active').data('category');
			if (!this.$('.offering:visible').length) {
				this.$('.open-arch-list').append($('<li class="no-offerings fade-in">There are currently no ' + category + ' notes.</li>'));
				this.$('.product-list-footer').hide();
				setTimeout(function() {
					$('.no-offerings').removeClass('fade-in');
				}, 2);
			} else {
				this.$('.product-list-footer').show();
			}
		}, 500),
		showOfferingModal: _.debounce(function(model) {
			if (!model) return;
			this.spProductViewer = Vm.create(this, 'SpProductViewer', SpProductViewer, {model: model});
			setTimeout(function() {
				$('.open-arch-list-filters li[data-category-id="'+ model.get('spCategoryId') +'"]').click();
			}, 2);
		}, 500, true),
		onCollectionSelect: function(model) {
			this.$('li.offering.active').removeClass('active');
			if (model) {
				this.$('[data-offering-id=' + model.id + ']').toggleClass('active');
				this.$('.open-arch-list-filters li[data-category-id="'+ model.get('spCategoryId') +'"]').click();
			}
		},
		onFilterClick: function(e){
			var elem = $(e.currentTarget);
			var category = elem.data('category');
			var categoryDesc = this.$('.category-desc');
			var categoryId = elem.data('category-id');
			var categoryDescText = this.collection.categories.get(categoryId).get('description');
			if (elem.hasClass('active')) return;

			this.$('.no-offerings').remove();
			this.$('.product-list-footer').hide();
			elem.siblings().removeClass('active');
			elem.addClass('active');
			this.isotope.arrange({filter: '.category-id-' + categoryId});
			categoryDesc.addClass('transition');
			setTimeout(function() {
				categoryDesc.text(categoryDescText);
				categoryDesc.removeClass('transition');
			}, 400);
		}
	});
	return ProductList;
});