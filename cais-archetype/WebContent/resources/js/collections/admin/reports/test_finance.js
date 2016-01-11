define([], function() {
var data = {
	"workingCapital": {
		"cashToDate": 4923146,
		"pendingReceivable": 1010389,
		// "total": 123300000,
		"platformLoan":  690000,
		"adjustedTotal":  6623535 
	},
	"workingCapitalOverTime": {
        "name": "Adjusted Total Over Time",
        "data": [10030000, 12330000, 14530000,13430000,17330000,14830000,15830000,15730000,16130000,17330000,17030000,17330000]
	},
	"ytdExpenses": {
		"fixedPersonnel": 5390000,
		"fixedPersonnelAllocation": 0.59,
		"fixedNonPersonnel": 1120000,
		"fixedNonPersonnelAllocation": 0.12,
		"fixedTotal":  6862921,
		"fixedAllocation": 0.12,
		"variableOneTime": 1100000,
		"variableOneTimeAllocation": 0.12,
		"variableOther": 1480000,
		"variableOtherAllocation": 0.16,
		"variableTotal": 3039904,
		"variableAllocation": 0.22,
		"oneTime": 1100000,
		"oneTimeAllocation": 0.12,
		"estMonthlyBurn": 760000,
		"total":  9902825 
	},
	"burnRate": [
		{
			"scenario": '0% Growth',
			"annualNet": '$6.5-10.8',
			'monthlyBurnRate': 358000,
			'zeroDate': '28mo.'
		},
		{
			"scenario": '50% Growth',
			"annualNet": '$9.8-10.8',
			'monthlyBurnRate': 83000,
			'zeroDate': '120mo.'
		},
		{
			"scenario": '75% Growth',
			"annualNet": '$11.4-10.8',
			'monthlyBurnRate': 50000,
			'zeroDate': 'n/a'
		},
		{
			"scenario": '100% Growth',
			"annualNet": '$13.0-10.8',
			'monthlyBurnRate': 183000,
			'zeroDate': 'n/a'
		}
	]
};
	
return data;
});