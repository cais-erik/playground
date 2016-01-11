/*
Base Checklist Content View
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/trade_ticket/checklist_views/base_checklist_content',
	'collections/trade_ticket/task_collections',
	'collections/trade_ticket/transaction_tasks',
	'text!templates/trade_ticket/checklist/comments.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseChecklistContent, TaskCollections, TransactionTasks, Template) {
	var Comments = BaseChecklistContent.extend({
		//_modelBinder: undefined,
		className: 'comments',
		template: Template,
		teamMemberTemplate: '{{#.}}<option value={{userId}} data-email="{{emailAddress}}" data-firmdid="{{firmId}}">{{name}}</option>{{/.}}',
		collection: TaskCollections.comments,
		title: 'Task Comments',
		preInit: function() {
			this.collection = new this.collection();
			this.collection.params.transactionTaskId = TransactionTasks.activeTask.get('transactionTaskId');
			this.collection.setUrl();
			this.listenTo(TaskCollections.teamMembers, 'sync', this.renderTeamMembers);
			this.listenTo(this.collection, 'add', this.addOne);
		},
		events: {
			'click .post-comment': 'postComment',
			'click .close-comment': 'closeComment',
			'click .reopen-comment': 'openComment'
		},
		postRender: function() {
			if (TaskCollections.teamMembers.length) {
				this.renderTeamMembers();
			} else {
				TaskCollections.teamMembers.fetch();
			}
		},
		postComment: function() {
			var comment = {
				comment: this.$('.add-comment-textbox').val(),
				toEmailList: []
			};
			if (!comment.comment.length) {
				Alert('No comment has been entered.', 'OK');
				return;
			}
			var emails = this.$('[name=notify]').val();
			_.each(emails, function(id) {
				if (id !== 'cais_team') {
					var member = TaskCollections.teamMembers.findWhere({'userId': parseInt(id)});
					comment.toEmailList.push({
						userId: member.get('userId'),
						emailAddress: member.get('emailaddress'),
						name: member.get('name')
					});
				} else {
					var member = TaskCollections.teamMembers.findWhere({'userId': id});
					comment.toEmailList.push({
						emailAddress: member.get('emailaddress'),
						name: member.get('name')
					});
				}
			}, this);
			this.collection.addComment(comment);
		},
		closeComment: function(e) {
			var elem = $(e.currentTarget);
			var id = parseInt(elem.parents('tr').attr('id'));
			this.collection.closeComment(id, {
				success: function() {
					elem.text('Reopen Comment').removeClass('close-comment').addClass('reopen-comment');		
				}
			});	
		},
		openComment: function(e) {
			var id = parseInt($(e.currentTarget).parents('tr').attr('id'));
			this.collection.openComment(id, {
				success: function() {
					elem.text('Close Comment').removeClass('reopen-comment').addClass('close-comment');
				}
			});
		},
		renderTeamMembers: function() {
			var template = Handlebars.compile(this.teamMemberTemplate);
			this.$('[name=notify]').html(template(TaskCollections.teamMembers.serializeWithCaisMembers()));
			kendo.init(this.$el);
		},
		addOne: _.debounce(function() {
			this.render();
			var newRow = this.$('.comment-row').first(); 
			newRow.hide();
			newRow.fadeIn('slow');
		}, 500),
		clean: function() {
			this.stopListening();
		}
	});
	return Comments;
});