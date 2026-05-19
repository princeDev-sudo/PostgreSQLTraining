using { PostgreSQLTraining as my } from '../db/schema.cds';

@path : '/service/PostgreSQLTrainingService'
service PostgreSQLTrainingService
{
    @cds.redirection.target
    @odata.draft.enabled
    entity User as
        projection on my.User;
}

annotate PostgreSQLTrainingService with @requires :
[
    'authenticated-user'
];
