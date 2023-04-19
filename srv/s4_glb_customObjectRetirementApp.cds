using objectRetirementApp as src from '../db/data-model';

service main {
    @Capabilities.InsertRestrictions.Insertable: true
    @Capabilities.DeleteRestrictions.Deletable : true
    @Capabilities.UpdateRestrictions.Updatable : true
    entity customObject as projection on src.customObject actions {
        action completeDeletion();
    };

    @readonly
    entity status       as projection on src.status;

    @readonly
    entity user         as projection on src.user;

    @cds.persistence.skip
    @odata.singleton
    entity excelUpload{
        @Core.MediaType : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        excel : LargeBinary;
    };

    action updateApprovalStatus(objectID : String, decision : String);
}
