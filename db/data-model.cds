namespace objectRetirementApp;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity customObject : cuid, managed {
    objectType  : String;
    objectName  : String;
    abapPackage : String;
    lastRunDate : Date;
    lastRunUser : String;
    approver    : Association to one user;
    approverEmail : String;
    status      : Association to one status;
}

@cds.persistence.exists : false
entity user {
    key userID       : String;
        userFullName : String;
        userEmail    : String;
}

entity status {
    key code: String(1);
        description : String;
}
