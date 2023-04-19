sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'objectRetirementApp.s4glbcustomobjectretirementappui',
            componentId: 'customObjectList',
            entitySet: 'customObject'
        },
        CustomPageDefinitions
    );
});