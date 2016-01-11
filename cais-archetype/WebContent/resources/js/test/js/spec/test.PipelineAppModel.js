define(["models/pipeline/pipeline_app_model", 'test/js/MockData', 'backbone'], function(PipelineAppModel, MockData, Backbone) {
	window.debug = PipelineAppModel;
	var defaults = {
		type: null, // ai, cm,
		lens: null, // grid', chart,
		transactionStatusId: null,
		filters: {
			type: null, //'cais',
			dataNode: {}
		},
		trade: false // false || object containing trade ticket attrs
	};
	var testData = {
		type: 'ai', // ai, cm,
		lens: 'grid', // grid', chart,
		transactionStatusId: 2,
		filters: {
			type: 'firm', //'cais',
			dataNode: {}
		},
		trade: false // false || object containing trade ticket attrs
	};
	describe("PipelineAppModel", function() {
		it('pipeline app model should init with correct default values' , function() {
			expect(PipelineAppModel.attributes).to.eql(defaults);
		});
		it('should return /ai/grid/2 from getUriComponent()' , function() {
			PipelineAppModel.set(testData);
			expect(PipelineAppModel.attributes).to.eql(testData);
			expect(PipelineAppModel.getUriComponent()).to.eql('/ai/grid/2');
		});
		it('should return correct status name from getActiveStatusName()' , function() {
			PipelineAppModel.set(testData);
			expect(PipelineAppModel.attributes).to.eql(testData);
			expect(PipelineAppModel.getActiveStatusName()).to.eql(PipelineAppModel._aiStatuses[PipelineAppModel.get('transactionStatusId')]);
		});
		it('selectedProducts should be a BB collection' , function() {
			expect(PipelineAppModel.selectedProducts).to.be.an.instanceof(Backbone.Collection);
		});
		it('should contain AI and CM status arrays' , function() {
			PipelineAppModel.set(testData);
			expect(PipelineAppModel._aiStatuses).to.be.an.instanceof(Array);
			expect(PipelineAppModel._cmStatuses).to.be.an.instanceof(Array);
			expect(PipelineAppModel.getActiveStatusName()).to.eql(PipelineAppModel._aiStatuses[PipelineAppModel.get('transactionStatusId')]);
		});
	});
	return {
		name: "Pipeline App Model"
	};
});