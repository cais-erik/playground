define([
	'underscore',
	'backbone',
	'collections/base_cais_collection',
	'models/pipeline/pipeline_app_model'
], function(_, Backbone, BaseCaisCollection, PipelineAppModel) {

	var TransactionModel = Backbone.Model.extend({
		// push the transactions to their own collection
		parse: function(response) {
		    // set the dates to date objects
            if (response.investmentDate) response.investmentDate = new Date(response.investmentDate);
        	if (response.subDueDate) response.subDueDate = new Date(response.subDueDate);
            if (response.wireDueDate) response.wireDueDate = new Date(response.wireDueDate);
			return response;
		}
	});

	var BaseOpportunities = BaseCaisCollection.extend({
		initialize: function() {
			this.onStatusIdChange();
			this.listenTo(PipelineAppModel, 'change:transactionStatusId', this.onStatusIdChange);
		},
		onStatusIdChange: function() {
			this.params.transactionStatusId = PipelineAppModel.get('transactionStatusId');
			this.setUrl();
		},
		params: {
			transactionStatusId: null
		},
		exportToExcel: function() {
			if (!this.length) {
				Alert('No transactions to export.', 'OK');
				return;
			}
			var activeStatus = PipelineAppModel.getActiveStatusName();
			var param = {
				fileName: activeStatus.replace(/ /g, '_') + "_Pipeline.xlsx",
				sheetName: activeStatus,
				builderName: "pipelineBuilder",
				data: JSON.stringify(this.toJSON())
			};
			$.download('/exportJsonToExcel', param, 'POST');
		},
		model:TransactionModel,
	});
	var BaseChartData = BaseOpportunities.extend({
		byAdvisor: new Backbone.Collection(),
		byProduct: new Backbone.Collection(),
		parse: function(response) {
			this.byProduct.reset();
			_.each(this.combineLowValues(response.msg.byProduct, 'product'), function(data) {
				this.byProduct.add(new this.byProduct.model(data));
			}, this);
			this.byAdvisor.reset();
			_.each(this.combineLowValues(response.msg.byAdvisor, 'Advisor'), function(data) {
				this.byAdvisor.add(new this.byAdvisor.model(data));
			}, this);
		},
		combineLowValues: function(arr, type) {
			if (arr.length > 15) {
				var total = 0;
				var otherCount = 0;
				var newArr = [];
				var aggregate = {totalValue: 0};
				aggregate[type] = 'Other';

				for (var i in arr) {
					total = total + arr[i].totalValue;
				}
				for (var i in arr) {
					if (arr[i].totalValue / total < 0.01) {
						otherCount++;
						aggregate.totalValue = aggregate.totalValue + arr[i].totalValue;
					} else {
						newArr.push(arr[i]);
					}
				}
				aggregate[type] = otherCount + ' Others < 1%';
				newArr.push(aggregate);
				return newArr;
			} else {
				return arr;
			}
		}
	});

	/** 
	 * Collections for all
	 */
	var AllOpportunities = BaseOpportunities.extend({
		baseUrl: '/getAllOpportunities'
	});
	var AllChartData = BaseChartData.extend({
		baseUrl: '/getGraphForAll'
	});

	/** 
	 * Collections for firms (clients)
	 */
	var OpportunitiesByClient = BaseOpportunities.extend({
		params: {
			id: null
		},
		baseUrl: '/getOpportunitiesByClient'
	});
	var ChartDataByClient = BaseChartData.extend({
		baseUrl: '/getGraphByClient',
	});

	/** 
	 * Collections for ADV teams
	 */
	var OpportunitiesByTeam = BaseOpportunities.extend({
		params: {
			advisorTeamId: null
		},
		baseUrl: '/getOpportunitiesByTeam'
	});
	var ChartDataByTeam = BaseChartData.extend({
		baseUrl: '/getGraphByTeam',
	});

	/** 
	 * Collections for Advisors
	 */
	var OpportunitiesByAdvisor = BaseOpportunities.extend({
		params: {
			userId: null
		},
		baseUrl: '/getOpportunitiesByAdvisor'
	});
	var ChartDataByAdvisor = BaseChartData.extend({
		baseUrl: '/getGraphByAdvisor',
	});

	/** 
	 * Collections for clients (investors)
	 */
	var OpportunitiesByInvestor = BaseOpportunities.extend({
		params: {
			investorId: null
		},
		baseUrl: '/getOpportunitiesByInvestor'
	});
	var ChartDataByInvestor = BaseChartData.extend({
		baseUrl: '/getGraphByInvestor',
	});

	/** 
	 * Collections for investmentEntities
	 */
	var OpportunitiesByInvestmentEntity = BaseOpportunities.extend({
		params: {
			investmentEntityId: null
		},
		baseUrl: '/getOpportunitiesByInvestmentEntity'
	});
	var ChartDataByInvestmentEntity = BaseChartData.extend({
		baseUrl: '/getGraphByInvestmentEntity',
	});

	var getActiveCollection = function() {
		var filters = PipelineAppModel.get('filters');
		switch (filters.type) {
			case 'cais':
			case 'CAIS':
				return new AllOpportunities();
				break;
			case 'Firm': // firm
				if (!filters.dataNode.id) throw 'A client ID must be defined to fetch client opportunities.';
				var model = new OpportunitiesByClient();
				model.params.id = filters.dataNode.id;
				break;
			case "Team":
				if (!filters.dataNode.advisorTeamId) throw 'A advisorTeamId must be defined to fetch advisor team opportunities.';
				var model = new OpportunitiesByTeam();
				model.params.advisorTeamId = filters.dataNode.advisorTeamId;
				break;
			case "Advisor":
				if (!filters.dataNode.userId) throw 'A userId must be defined to fetch advisor opportunities.';
				var model = new OpportunitiesByAdvisor();
				model.params.userId = filters.dataNode.userId;
				break;
			case "Client":
				if (!filters.dataNode.investorId) throw 'A investorId must be defined to fetch client(investor) opportunities.';
				var model = new OpportunitiesByInvestor();
				model.params.investorId = filters.dataNode.investorId;
				break;
			case "Entity":
				if (!filters.dataNode.investmentEntityId) throw 'A investmentEntityId must be defined to fetch investment entity opportunities.';
				var model = new OpportunitiesByInvestmentEntity();
				model.params.investmentEntityId = filters.dataNode.investmentEntityId;
				break;
		}
		model.setUrl();
		return model;
	};

	var getActiveChartCollection = function() {
		var filters = PipelineAppModel.get('filters');
		switch(filters.type) {
			case 'cais':
			case 'CAIS':
				return new AllChartData();
			case "Firm":
				if (!filters.dataNode.id) throw 'A client ID must be defined to fetch client opportunities.';
				var model = new ChartDataByClient();
				model.params.id = filters.dataNode.id;
				break;
			case "Team":
				if (!filters.dataNode.advisorTeamId) throw 'A advisorTeamId must be defined to fetch client opportunities.';
				var model = new ChartDataByTeam();
				model.params.advisorTeamId = filters.dataNode.advisorTeamId;
				break;
			case "Advisor":
				if (!filters.dataNode.userId) throw 'A userId must be defined to fetch client opportunities.';
				var model = new ChartDataByTeam();
				model.params.userId = filters.dataNode.userId;
				break;
			case "Client":
				if (!filters.dataNode.investorId) throw 'A investorId must be defined to fetch client(investor) opportunities.';
				var model = new ChartDataByInvestor();
				model.params.investorId = filters.dataNode.investorId;
				break;
			case "Entity":
				if (!filters.dataNode.investmentEntityId) throw 'A investmentEntityId must be defined to fetch investment entity opportunities.';
				var model = new ChartDataByInvestmentEntity();
				model.params.investmentEntityId = filters.dataNode.investmentEntityId;
				break;
		}
		model.setUrl();
		return model;
	};

	return {
		getActiveCollection: getActiveCollection,
		getActiveChartCollection: getActiveChartCollection
	};
});