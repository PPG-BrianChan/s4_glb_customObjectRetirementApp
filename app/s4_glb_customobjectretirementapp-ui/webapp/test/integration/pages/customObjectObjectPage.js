sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'objectRetirementApp.s4glbcustomobjectretirementappui',
            componentId: 'customObjectObjectPage',
            entitySet: 'customObject'
        },
        CustomPageDefinitions
    );
});