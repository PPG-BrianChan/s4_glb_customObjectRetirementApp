sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'objectRetirementApp/s4glbcustomobjectretirementappui/test/integration/FirstJourney',
		'objectRetirementApp/s4glbcustomobjectretirementappui/test/integration/pages/customObjectList',
		'objectRetirementApp/s4glbcustomobjectretirementappui/test/integration/pages/customObjectObjectPage'
    ],
    function(JourneyRunner, opaJourney, customObjectList, customObjectObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('objectRetirementApp/s4glbcustomobjectretirementappui') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThecustomObjectList: customObjectList,
					onThecustomObjectObjectPage: customObjectObjectPage
                }
            },
            opaJourney.run
        );
    }
);