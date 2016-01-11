define([
	'models/tree/tree_events',
	'models/authed_user'
], function(TreeEvents, User) {
	var investmentEntities = {
		transport: {
			read: function (options) {
				$.ajax({
					url: "/getInvestmentEntitiesHierarchy",
					dataType: "json",
					data: {
						investorId: options.data.investorId
					},
					success: function (result) {
						options.success(result.msg);
					}
				});
			}
		},
		schema: {
			parse: function(response) {
				$.each(response, function(i, entity) {
					entity.displayName = entity.investmentEntityName;
					entity.categoryName = 'Entity'
				});
				return response;
			},
			model: {
				id: "investmentEntityId",
				hasChildren: false
			}
		}
	};
	var investors = {
		transport: {
			read: function (options) {
				var item = dataSource.get(options.data.userId);
				$.ajax({
					url: "/getInvestorHierarchy",
					dataType: "json",
					data: {
						userId: options.data.userId,
						advisorTeamId: item.advisorTeamId
					},
					success: function (result) {
						options.success(result.msg);
					}
				});
			}
		},
		schema: {
			parse: function(response) {
				$.each(response, function(i, investor) {
					investor.displayName = investor.investorName;
					investor.categoryName = 'Client'
				});
				return response;
			},
			model: {
				id: "investorId",
				children: investmentEntities,
				hasChildren: "hasChildren"
			}
		}
	};            
	var advisors = {
		transport: {
			read: function (options) {
				$.ajax({
					url: "/getHierarchyWealthAdvisorList",
					dataType: "json",
					data: {
						advisorTeamId: options.data.advisorTeamId
					},
					success: function (result) {
						for (var i = 0; i < result.msg.length; i++) {
							result.msg[i].advisorUniqueID = parseInt(result.msg[i].advisorTeamId.toString() + result.msg[i].userId.toString());
						}
						options.success(result.msg);
					}
				});
			}
		},
		schema: {
			parse: function(response) {
				$.each(response, function(i, advisor) {
					advisor.displayName = advisor.name;
					advisor.categoryName = 'Advisor'
				});
				return response;
			},
			model: {
				id: "userId",
				children: investors,
				hasChildren: "hasChildren"
			}
		}
	};
	var teams = {
		transport: {
			read: function (options) {
				$.ajax({
					url: "/getHierarchyAdvisorTeams",
					dataType: "json",
					data: {
						id: options.data.clientId,
						isCAISAccountHierarchy: "true"
					},
					success: function (result) {
						options.success(result.msg);
					}
				});
			}
		},
		schema: {
			parse: function(response) {
				$.each(response, function(i, team) {
					team.displayName = team.teamName;
					team.categoryName = 'Team'
				});
				return response;
			},
			model: {
				id: "advisorTeamId",
				children: advisors,
				hasChildren: "hasChildren"
			}
		}
	};
	var clients = {
		transport: {
			read: function (options) {
				$.ajax({
					url: "/constructCAISAccountHierarchy",
					dataType: "json",
					data: {
						isCAISAccountHierarchy: "true"
					},
					success: function (result) {
						options.success(result.msg);
					}
				});
			}
		},
		schema: {
			parse: function(response) {
				$.each(response, function(i, client) {
					client.displayName = client.clientName;
					client.categoryName = 'Firm'
				});
				return response;
			},
			model: {
				id: "clientId",
				children: teams,
				hasChildren: "hasChildren"
			}
		}
	};
	var caisNode = {
		data: [{name: "CAIS", type: "CAIS", displayName: 'CAIS', categoryName: 'CAIS', fragment: 'cais'}],
		schema: {
			model: {
				children: clients,
				hasChildren: true
			}
		}
	};

	var dataSource;
	if (User.get('caisemployee')) {
		dataSource = new kendo.data.HierarchicalDataSource(caisNode);
	} else {
		dataSource = new kendo.data.HierarchicalDataSource(clients);
	}


	var dataApi = {
	};

	return {
		data: dataSource,
		api: dataApi
	}
});