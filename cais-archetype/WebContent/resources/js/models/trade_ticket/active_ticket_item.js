define([
	'underscore',
	'backbone',
	'events',
	'models/base_cais_model',
	'collections/trade_ticket/transaction_tasks',
], function(_, Backbone, Events, BaseModel, TransactionTasks) {
	var ActiveTicket = BaseModel.extend({
		idAttribute: 'productId',
		baseUrl: '/getSubscriptionDataList',
		params: {
			transactionId: null
		},
		transactionTasks: TransactionTasks,
		initialize: function(options) {
			this.listenTo(Events, 'fund:added', this.fetch);
		},
		parse: function(resp, options) {
			if (resp.status === 'failure') {
				Alert('Could not load this trade ticket. Please make sure you have access to this trade.', 'OK');
				Events.trigger('error:ticketLoadFailure');
				return;
			}
			if (resp.msg) {
				return resp.msg[0];
			} else {
				return resp;
			}
		},
		/*
		 * Sets the addendum requirement to true or flase
		 * @returns empty map or addendum documentId and name
		 * @param options, options object containing success, error callbacks and value boolean
		 */
		setAddendum: function(options) {
			options = _.extend({}, options);
			var data = {
				investmentEntityId: this.get('investmententityid'),
				subscriptionId: this.get('subscriptionId'),
				isAddendumRequired: options.value,
				transactionId: this.params.transactionId
			};
			$.postJSON('/api/transaction/ai/addendum_required', data, function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		setTransactionId: function() {
			this.setUrl();
			TransactionTasks.params.transactionId = this.params.transactionId;
			TransactionTasks.setUrl();
		},
		downloadDocuments: function(docIds) {
			if (typeof docIds[0] == 'undefined' || docIds[0] == null) {
				var alert = new Alert("Please select at least one document.", "OK");
				return;
			}

			var paramString = "docId=";
			for (var i = 0; i < docIds.length; i++) {
				paramString = paramString + docIds[i] + "&docId=";
			}
			paramString = paramString.substring(0, paramString.length - 7) + "&transactionId=" + this.params.transactionId;
			$.download('/downloadForDSA', paramString, 'POST');
		},
		presentDocs: function(params, options) {
			options = $.extend({}, options);
			var that = this;
			var details = {
				clientId: this.get('clientId'),
				transactionId: this.params.transactionId
			};
			params = _.extend(details, params);
			Server.sendMailWithAttachment(JSON.stringify(params), function () {
				that.insertTransactionEventLog("Email sent for Documents Presented To Investor", params.body);
				if (options.success) options.success();
			});
		},
		insertTransactionEventLog: function(event, details) {
			var eventLog = {
				transactionId: this.params.transactionId,
				event: event,
				details: details
			};
			var eventLogStr = JSON.stringify(eventLog);
			Server.insertEventLog(eventLogStr, function () {});
		},
		fetchFundsForRegeneration: function() {
			var funds = this.get('funds');
			var serializedAttrs = ['investmentDate','productTypeId','shareClass','placementFee','adminTypeId','investmentEntityId','productId','amount','userId', 'caisId', 'transactionId', 'subscriptionId'];
			_.each(funds, function(fund, i) {
				fund = _.pick(fund, serializedAttrs);
				fund.isCAISFund = this.get('isCaisFund');
				fund.subscriptionId = this.get('subscriptionId');
				funds[i] = fund;
			}, this);
			return funds;
		},
		regenerateDocs: function(options) {
			options = _.extend({}, options);
			var that = this;
			$.postJSON("/updateSubscriptionDocumentAndTransaction", JSON.stringify(this.fetchFundsForRegeneration()), function(response) {
				if (response.status === 'failure' && options.error) {
					options.error(response.msg);
				}
				else if (options.success) {
					that.insertTransactionEventLog("Subscription Data Edited", "User regenerated Subscription Documents");
					options.success(response);
				}
			});
		},
		approveTask: function() {
			var that = this;
			if (this.transactionTasks.activeTask.get('taskCode') === 4) { // upload docs
				this.sendSubscriptionEmail();
				return;
			}
			this.approveTransactionTask();
		},
		approveTransactionTask: function() {
			var that = this;
			var data = {
				subscriptionId: this.get('subscriptionId'),
				taskId: this.transactionTasks.activeTask.get('taskCode')
			};
			Server.approveTransactionTask(data, function (response) {
				Events.trigger('task:approved', that.transactionTasks.activeTask);
				if (data.taskId === 1) { // review docs
					that.insertTransactionEventLog("Subscription Documents Approved", "User approved the Subscription Documents");
				}
			});
		},
		sendSubscriptionEmail: function() {
			var that = this;
			var subscriptionEmail = {
				'subscriptionId': this.get('subscriptionId'),
				'transactionEventLog': {
					'transactionId': this.params.transactionId,
					'event': "Uploaded Executed Subscription Documents",
					'details': "User submitted executed documents"
				},
				'clientId': that.get('clientId'),
				'docIds': that.addedDocIds || []
			};
			$.postJSON("/sendSubscriptionEmail", JSON.stringify(subscriptionEmail), function (resp) {
				if (resp.msg.submissionMessage) {
					var msg = '';
					_.each(resp.msg.submissionMessage, function(value, key) {
						msg = msg + key + ': ' + value + '<br/><br/>';
					});
					new Alert(msg, 'OK');
				}
				that.approveTransactionTask();
			}).error(function(response) {
				Events.trigger('task:error', response);
				try {
					new Alert(JSON.parse(response.responseText).errorType, 'OK');
				} catch (error) {
					new Alert('There was a problem sending the subscription documents.', 'OK');
				}
			});
		},
		rejectTask: function () {
			var taskId = this.transactionTasks.activeTask.get('taskCode');
			if (taskId == 1) this.insertTransactionEventLog("Subscription Documents Rejected", "User rejected the Subscription Documents");
			Events.trigger('task:rejected' + taskId, this.transactionTasks.activeTask);
		}
	});
	return new ActiveTicket();
});