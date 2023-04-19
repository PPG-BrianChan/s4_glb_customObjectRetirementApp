using main from './s4_glb_customObjectRetirementApp';

annotate main.user with {
    userID       @Common.Text : userFullName
                 @title : '{i18n>title}';
    userFullName @title : '{i18n>fullName}';
    userEmail    @title : '{i18n>email}'
}
