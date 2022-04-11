using qpe.cloud from '../db/schema';

service RequestAdmin {
    function getOpenIncidents() returns array of String;
    function getIncidentsFromTopic(topic_ID:Integer) returns array of String;
    function setIncidentStatus(incident_ID:UUID, status:Integer) returns String;
}
