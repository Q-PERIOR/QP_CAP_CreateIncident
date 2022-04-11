using qpe.cloud from '../db/schema';

service RequestUser {
    function getOpenIncidents(creator:String) returns array of String;
    function getStatusOfIncidentByID(incident_ID:UUID) returns array of String;
    function createIncident(creator:String,topicName:String,priority:String,title:String,message:String) returns array of String;
}
