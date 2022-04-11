const cds = require('@sap/cds')

module.exports = cds.service.impl(srv => {
    
    // Get date for today
    let today = new Date().toISOString().slice(0, 10)

    srv.on ('getOpenIncidents', _getOpenIncidents)
    srv.on ('getIncidentsFromTopic', _getIncidentsFromTopic)
    srv.on ('setIncidentStatus', _setIncidentStatus)

    async function _getOpenIncidents (req) {
        const db = await cds.connect.to('db')
        const { Incident } = db.entities 

        let userInput = req.data
        let openIncidentsFromUser
        let resultArray = []
            
        openIncidentsFromUser = SELECT .from `Incident` .where `status <> 9`
        
        // Execute query
        const query = await cds.run(openIncidentsFromUser)
        
        // Put results into array and return
        query.forEach( item => {
            resultArray.push(item)
        })
        
        return resultArray
    }

    async function _getIncidentsFromTopic (req) {
        const db = await cds.connect.to('db')
        const { Incident } = db.entities 

        let userInput = req.data
        let IncidentsOfTopic
        let resultArray = []

        if (!userInput.topic_ID) {
            req.error(401, "No topic selected!")
        } 
            
        IncidentsOfTopic = SELECT .from `Incident` .where `topic_ID = ${userInput.topic_ID}`
        
        // Execute query
        const query = await cds.run(IncidentsOfTopic)
        
        // Put results into array and return
        query.forEach( item => {
            resultArray.push(item)
        })
        
        return resultArray
    }

    async function _setIncidentStatus (req) {
        const db = await cds.connect.to('db')
        const { Incident } = db.entities 

        let userInput = req.data
        let errorOccured = false
        let message
        let incidentQuery
        let resultArray = []

        if (!userInput.incident_ID) {
            req.error(401, "No ID selected!")
            errorOccured = true;
        } 
        if (!userInput.status) {
            req.error(402, "No status set!")
            errorOccured = true;
        } 

        incidentQuery = SELECT.one .from `Incident` .where `ID = ${userInput.incident_ID}`
        const incident = await cds.run(incidentQuery)
        if (!incident) {
            req.error(403, "No incident found!")
            errorOccured = true;
        }
        
        if (errorOccured == false) {
            await cds.transaction(req).run(UPDATE `Incident` .set `status = ${userInput.status}` .where `ID = ${userInput.incident_ID}`);
            message = "Status of " + userInput.incident_ID + " successfully changed to  " + userInput.status + "." ;
        }
        
        return message
    }
})