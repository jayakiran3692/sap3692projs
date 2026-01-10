sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/ust/vendor/vendor/test/integration/pages/vendorList",
	"com/ust/vendor/vendor/test/integration/pages/vendorObjectPage"
], function (JourneyRunner, vendorList, vendorObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/ust/vendor/vendor') + '/test/flp.html#app-preview',
        pages: {
			onThevendorList: vendorList,
			onThevendorObjectPage: vendorObjectPage
        },
        async: true
    });

    return runner;
});

