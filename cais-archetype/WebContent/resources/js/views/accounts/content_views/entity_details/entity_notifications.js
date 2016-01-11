define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_notifications.html',
	'models/entity_info',
	'views/accounts/content_views/entity_details/notifications/notification_table',
	'views/accounts/content_views/entity_details/notifications/notification_details',
	'views/assets/confirm_dialog',
], function ($, _, Backbone, Vm, Handlebars, BaseDetailsView, Template, 
             EntityInfoModel, NotificationTable, NotificationDetails, ConfDialog) {
	var view = BaseDetailsView.extend({
		clientNotificationsLastSavedValue: null,
		advisorNotificationsLastSavedValue: null,
		panelId: 15,
		template: Template,
		confDialog: ConfDialog,
		//override the render method to inject the notifications collection to template
		postRender: function() {
			this.notificationTable = Vm.create(this, 'NotificationsTable', NotificationTable, {id: this.model.id});
			this.notificationDetails = Vm.create(this, 'NotificationDetails', NotificationDetails, this.options);
			this.$('.notifications-table-container').html(this.notificationTable.$el);
			this.$('.notification-details-container').append(this.notificationDetails.$el);

			this.listenTo(this.notificationTable, 'rowSelected', this.onRowSelect);
			this.listenTo(this.notificationDetails, 'partyUpdate', _.bind(this.notificationTable.refresh, this.notificationTable));
			this.listenTo(this.model, 'change:overRideAdvisorEmail', this.onAlternateAdvisorEmailChange);

			this.onAlternateAdvisorEmailChange();			
		},
		onRowSelect: function(model) {
			this.notificationDetails.loadModel(model);
		},
		events: {
			'click .create-party': 'createPartyClickHandler',
			'change [name=postOnly]': 'onPostOnlyChange',
			'change [name=overRideAdvisorEmail]': 'overRideAdvisorEmailHandler',
			'change [name=alternateAdvisorEmail]': 'inputChangeHandler'
		},
		overRideAdvisorEmailHandler: function(e) {
			this.model.set('overRideAdvisorEmail', $(e.currentTarget).prop('checked'));
		},
		onAlternateAdvisorEmailChange: function() {
			var value = this.model.get('overRideAdvisorEmail');
			if (value) {
				this.$('.show-for-alternateAdvisorEmail').slideDown();
			} else {
				this.$('.show-for-alternateAdvisorEmail').slideUp();
			}
			
		},
		onPostOnlyChange: function(e) {
			var checked = $(e.currentTarget).prop('checked');
			this.model.set('postOnly', checked);
		},
		createPartyClickHandler: function() {
			var notificationModel = new this.notificationTable.entityNotifications.model({name: 'New contact...'});
			this.notificationTable._activeRow = notificationModel;
			this.notificationTable.entityNotifications.add(notificationModel);
			this.notificationDetails.createNew(notificationModel);
		},
		// override the save method to save notifications before entity details
		saveModel: function(event) {

			if (this.clientNotificationsLastSavedValue == null) {
				this.clientNotificationsLastSavedValue = this.notificationTable.clientNotificationsInitialValue;
			}

			if (this.advisorNotificationsLastSavedValue == null) {
				this.advisorNotificationsLastSavedValue = this.notificationTable.advisorNotificationsInitialValue; 
			}

			var that = this;
			var callServer = function() {
					var args = arguments;
					// update the notifications list
					that.notificationTable.entityNotifications.updateNotifications({
						success: _.bind(function(response) {
							// call the default view save method
							BaseDetailsView.prototype.saveModel.apply(that, args);

							var models = that.notificationTable.entityNotifications.models;
							var clientModel = findModelByNotificationType(models,'CLIENT');
							var advisorModel = findModelByNotificationType(models,'ADVISOR');
							that.clientNotificationsLastSavedValue = clientModel.attributes.notification;
							that.advisorNotificationsLastSavedValue = advisorModel.attributes.notification;
						}, that)
					});
			};

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

			var models = this.notificationTable.entityNotifications.models;
			var clientModel = findModelByNotificationType(models,'CLIENT');
			var advisorModel = findModelByNotificationType(models,'ADVISOR');
			
			if (clientModel && advisorModel) {
				var advisorNotificationsAreOff = advisorModel.attributes.notification == 'false';
				var advisorNotificationsWereJustChanged = advisorModel.attributes.notification != this.advisorNotificationsLastSavedValue;
	
				var clientNotificationsAreOn = clientModel.attributes.notification == 'true';						
				var clientNotificationsWereJustChanged = clientModel.attributes.notification != this.clientNotificationsLastSavedValue;
	
				var clientAndOrAdvisorNotificationsWereJustChanged = advisorNotificationsWereJustChanged || clientNotificationsWereJustChanged
	
				var showAlert = advisorNotificationsAreOff 
									&& clientNotificationsAreOn
									&& clientAndOrAdvisorNotificationsWereJustChanged;
				
				if (showAlert) {
					Vm.create(this, 'AdvisorNotificationPrompt', ConfDialog, {
						message: 'By clicking “yes”, you are confirming that you, as an advisor to the investor,'+ 
						         ' will not receive notices that they receive as an investor.'+
						         ' If you wish to be copied on those notices, please click no.',
						confirm_text: 'Yes',
						cancel_text: 'No',
						confirmCallback: callServer
					});
					return;
				}
			}

			callServer();
		}
	});
	return view;
});