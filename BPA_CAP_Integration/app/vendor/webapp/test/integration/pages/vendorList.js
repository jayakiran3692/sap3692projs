sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.ust.vendor.vendor',
            componentId: 'vendorList',
            contextPath: '/vendor'
        },
        CustomPageDefinitions
    );
});