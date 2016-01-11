define(["models/product/syndicate_equity_offering", 'test/js/MockData'], function(Offering, MockData) {
	var testOffering = new Offering(MockData.cmEquityOffering);
	describe("CmEquityOffering", function() {
		it('idAttribute should be internalCusip', function() {
			expect(testOffering.idAttribute).to.eql('internalCusip');
		});
		it('id should be CEQ0000008', function() {
			expect(testOffering.id).to.eql('CEQ0000008');
		});
		it('getName function should return Test' , function() {
			expect(testOffering.getName()).to.eql('Test');
		});
		it('getEmailUrl should return /api/products/syndicate/offerings/equity/CEQ0000008/preview', function() {
			expect(testOffering.getEmailUrl()).to.eql('/api/products/syndicate/offerings/equity/CEQ0000008/preview');
		});
		it('getEditUrl should return edit/equity/CEQ0000008', function() {
			expect(testOffering.getEditUrl('edit/equity/CEQ0000008')).to.eql('edit/equity/CEQ0000008');
		});
		it('orderPeriodEndDate change should change orderPeriodDesc', function() {
			testOffering.set('orderPeriodEndDate', '2013-12-20T09:00:00.000Z');
			expect(testOffering.get('orderPeriodDesc')).to.eql('Indications of interest will be accepted until 4:00 AM, ');
		});
		it('orderPeriodEndDate change should not change orderPeriodDesc if orderPeriodDesc is not default', function() {
			testOffering.set('orderPeriodDesc', 'test');
			testOffering.set('orderPeriodEndDate', '2013-12-20T03:00:00.000Z');
			expect(testOffering.get('orderPeriodDesc')).to.eql('test');
		});
	});
	
	return {
		name: "Cm Equtiy Offering"
	};
});