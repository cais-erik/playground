define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/accounts/entity/notifications/notifications_table.html',
	'collections/entity_notifications'
], function ($, _, Backbone, Handlebars, Template, EntityNotifications) {
	var view = Backbone.View.extend({
		clientNotificationsInitialValue: null,
		advisorNotificationsInitialValue: null,
		initialize: function() {
			this.entityNotifications = new EntityNotifications();
			this.entityNotifications.params.investmentEntityId = this.options.id;
			this.entityNotifications.setUrl();
			this.refresh();
			this.listenTo(this.entityNotifications, 'add', this.render);
		},
		render: function() {
			
			var findModelByNotificationType = function(models, typeToFind) {
				var numOfModels = models.length;
				var index;
				for (index = 0; index < numOfModels; index++) {
					var type = models[index].attributes.notificationType;
					if (type == typeToFind) {
						return models[index];
					}
				} 
			}
			
			var context = {
				parties: this.entityNotifications.toJSON()
			};

			var clientModel = findModelByNotificationType(this.entityNotifications.models,'CLIENT');
			if (clientModel) {
				this.clientNotificationsInitialValue  = clientModel.attributes.notification;
			}

			var advisorModel = findModelByNotificationType(this.entityNotifications.models,'ADVISOR');
			if (advisorModel) {
				this.advisorNotificationsInitialValue = advisorModel.attributes.notification;
			}

			var template = Handlebars.compile(Template);
			this.$el.html(template(context));
			if (this._activeRow) {
				if (this.$('tr#new-party').length) this.$('tr#new-party').addClass('selected');
				else this.$('tr#' + this._activeRow.id).addClass('selected');
			}
		},
		refresh: function() {
			var that = this;
			this.entityNotifications.fetch({
				success: function(collection) {
					that._activeRow = collection.at(0);
					that.trigger('rowSelected', that._activeRow);
					that.render();
				}
			});
		},
		events: {
			'click .notifications-list tr': 'rowClickHandler',
			//'click .show-interested-party': 'showInterestedPartyClickHandler',
			'click .create-party': 'createPartyClickHandler',
			'click .removeContact': 'removeClickHandler',
			'change .notification-radio': 'notificationChangeHandler',
			'change .preference': 'prefChangeHandler'
		},
		rowClickHandler: function(event) {
			if ($(event.target).is('input')) return;
			this._activeRow = this.entityNotifications.get($(event.currentTarget).attr('id'));
			this.$('tr.selected').removeClass('selected');
			$(event.currentTarget).addClass('selected');
			this.trigger('rowSelected', this._activeRow);
		},
		notificationChangeHandler: function(event) {
			var elem = $(event.target);
			var model = this.entityNotifications.get(elem.attr('name'));
			model.set('notification', elem.val());
		},
		prefChangeHandler: function(event) {
			var elem = $(event.target);
			var model = this.entityNotifications.get(elem.parents('tr').attr('id'));
			model.set(elem.attr('data-name'), elem.is(':checked'));
		},
		removeClickHandler: function(event) {
			var model = this.entityNotifications.get($(event.target).parents('tr').attr('id'));
			model.destroy({
				success: function() {
					$(event.target).parents('tr').slideUp('slow', function(){$(this).remove()});
				}
			});
		}
	});
	return view;
});