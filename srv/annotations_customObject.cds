using main from './s4_glb_customObjectRetirementApp';

annotate main.customObject with @odata.draft.enabled : true;

/*
 Title
*/

annotate main.customObject with {
    objectType  @title : '{i18n>objectType}'
                @mandatory;
    objectName  @title : '{i18n>objectName}'
                @mandatory;
    abapPackage @title : '{i18n>abapPackage}'
                @mandatory;
    lastRunDate @title : '{i18n>lastRunDate}'
                @mandatory;
    lastRunUser @title : '{i18n>lastRunUser}'
                @mandatory;
    approver    @title : '{i18n>approver}';
    status      @title : '{i18n>status}'
                @readonly;
    ID          @title : '{i18n>ID}';
    createdAt   @title : '{i18n>createdAt}';
    createdBy   @title : '{i18n>createdBy}';
    modifiedAt  @title : '{i18n>modifiedAt}';
    modifiedBy  @title : '{i18n>modifiedBy}';
};

/*
 UI
*/

annotate main.customObject with @UI : {
    SelectionFields    : [
        approver_userID,
        objectName,
        objectType,
        status_code
    ],
    LineItem           : [
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'main.completeDeletion',
            Label  : 'Complete Deletion'
        },
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'main.executeProcess',
            Label  : 'Send for Approval'
        },
        {
            $Type : 'UI.DataField',
            Value : objectType,
        },
        {
            $Type : 'UI.DataField',
            Value : objectName,
        },
        {
            $Type : 'UI.DataField',
            Value : abapPackage,
        },
        {
            $Type : 'UI.DataField',
            Value : lastRunDate,
        },
        {
            $Type : 'UI.DataField',
            Value : lastRunUser,
        },
        {
            $Type : 'UI.DataField',
            Value : approver_userID,
        },
        {
            $Type : 'UI.DataField',
            Value : status_code,
        }
    ],

    /*
     UI Header
    */

    HeaderInfo         : {
        TypeName       : '{i18n>customObject}',
        TypeNamePlural : '{i18n>customObjects}',
        Title          : {Value : objectType},
        Description    : {Value : objectName}
    },

    HeaderFacets       : [{
        $Type  : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#Header',
    }, ],

    /*
     Facets and field groups
    */

    Facets             : [
        // {
        //     $Type  : 'UI.ReferenceFacet',
        //     Target : '@UI.FieldGroup#Header',
        //     Label  : '{i18n>Header}',
        // },
        {
            $Type  : 'UI.ReferenceFacet',
            Target : '@UI.FieldGroup#Basic',
            Label  : '{i18n>ApprovalDetails}',
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Target : '@UI.FieldGroup#Admin',
            Label  : '{i18n>AdminData}',
        },
    ],

    FieldGroup #Admin  : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Value : createdAt},
            {Value : createdBy},
            {Value : modifiedAt},
            {Value : modifiedBy}
        ],
    },

    FieldGroup #Basic  : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Value : approver_userID},
            {Value : status_code}
        ]
    },

    FieldGroup #Header : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            // {Value: objectType},
            // {Value: objectName},
            {Value : abapPackage},
            {Value : lastRunDate},
            {Value : lastRunUser},
        ],
    }
};

/*
 Value Help and descriptive text
*/

annotate main.customObject with {
    approver @Common : {
        Text            : approver.userFullName,
        TextArrangement : #TextLast,
        ValueList       : {
            CollectionPath : 'user',
            Parameters     : [
                {
                    $Type             : 'Common.ValueListParameterInOut',
                    LocalDataProperty : approver_userID,
                    ValueListProperty : 'userID',
                },
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : approverEmail,
                    ValueListProperty : 'userEmail',
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'userFullName',
                },
            ]
        }
    };

    status   @Common : {
        Text            : status.description,
        TextArrangement : #TextOnly,
        ValueList       : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'status',
            Parameters     : [
                {
                    $Type             : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_code,
                    ValueListProperty : 'code',
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                },
            ],
        },
    }
}
