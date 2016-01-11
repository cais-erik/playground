define([
	'underscore',
	'backbone',
	'models/cached_model',
	'collections/setup/contact_list'
], function(_, Backbone, BaseModel, ContactList) {
	/** 
	 * BaseProductModel class
	 * Model class for a product
	 * Extends CachedModel
	 */
	var BaseProductModel = BaseModel.extend({
		defaults: {},
		_documentCategoryId: 44,
		urlRoot: '/api/products/syndicate/offerings',
		/** 
		 * Publish offering 
		 * @param options, object, containing success and error callbacks
		 */
		publishOffering: function(options) {
			options = $.extend({}, options);
			$.postJSON(this.urlRoot + '/publish', {id: this.id}, function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * manage offering visibility
		 * @param options, object, containing success and error callbacks and visible boolean
		 */
		manageOfferVisibility: function(options) {
			options = $.extend({}, options);
			$.postJSON(this.urlRoot + '/visibility/' + this.id, {visible: options.visible}, function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Expires an offering
		 * @param options, object, containing success and error callbacks
		 */
		expireOffering: function(options) {
			options = $.extend({}, options);
			$.postJSON(this.urlRoot +'/expire/' + this.id, null, function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Sends offering email
		 * @param options, object, containing success and error callbacks
		 * @param list, array, list of recipients
		 */
		sendEmail: function(list, options) {
			options = $.extend({}, options);
			$.postJSON(this.urlRoot + '/' + this.id +'/notify', list, function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Gets the HTML email preview of an offering
		 * @param options, object, containing success and error callbacks
		 */
		getEmailPreview: function(options) {
			options = $.extend({}, options);
			$.get(this.urlRoot + '/' + this.id + '/preview', function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Gets the URL of the email preview
		 * @param options, object, containing success and error callbacks
		 */
		getEmailUrl: function(options) {
			return this.urlRoot + '/' + this.id + '/preview';
		},
		/** 
		 * Gets the URL of the edit link for the model
		 */
		getEditUrl: function() {
			var assetType = this.get('assetClass');
			switch (assetType) {
				case 'Preferred Stock':
				case 'preferred_stock':
					return 'edit/preferred/' + this.id;
				case 'Equity':
				case 'equity':
					return 'edit/equity/' + this.id;
				case 'Bond':
				case 'bond':
					return 'edit/bond/' + this.id;
				default:
					return 'edit/' + this.id;
			}
		},
		/*
		returns a contact list collection for a given offering
		@param type: the notification type, PRELIMINARY_PROSPECTUS, FINAL_PROSPECTUS, PRICING_SHEET, IOI
		*/
		getContactList: function(contentType) {
			var collection = new ContactList([], {url: '/api/syndicate/published_offer/' + this.id +'/contact_list'});
			if (contentType) collection.url = '/api/syndicate/published_offer/' + this.id +'/contact_list?contentType=' + contentType;
			return collection;
		},
		/** 
		 * Returns the document category ID for this product
		 */
		getDocumentCategoryId: function() { return this._documentCategoryId; }
	});
	return BaseProductModel;
});