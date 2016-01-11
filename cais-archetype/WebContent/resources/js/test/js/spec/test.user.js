define(["models/user/user", 'test/js/MockData'], function(User, MockData) {
	var testUser = new User(MockData.user);

	describe("User Model", function() {
		// console.log(testUser.toJSON());
		it('Permissions should initialize as empty array', function() {
			// assert(Array.isArray([]), 'Permissions is not an array.');
			expect(testUser.defaults.permissions.length).to.equal(0);
		});
		it('idAttribute should be userId', function() {
			expect(testUser.idAttribute).to.be.a('string');
			expect(testUser.idAttribute).to.equal('userId');
		});
		it('Address should be a nested object', function() {
			expect(testUser.get('address')).to.be.a('object');
		});
		it('clientId should be an integer and equal 34', function() {
			expect(testUser.get('clientId')).to.equal(34);
		});
		it('Permissions function should properly set permissions', function() {
			testUser.setFunctionPermission(1, true);
			expect(testUser.get('permissions')).to.eql([1]);
		});
		it('Permissions function should properly unset permissions', function() {
			testUser.setFunctionPermission(1, false);
			expect(testUser.get('permissions')).to.eql([]);
		});
	});
	
	return {
		name: "User Model"
	};
});