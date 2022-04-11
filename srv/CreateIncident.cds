using qpe.cloud from '../db/schema';

service CreateIncident {
    entity Responsible as projection on cloud.Responsible;
    entity Topic as projection on cloud.Topic;
    entity Incident as projection on cloud.Incident;
}