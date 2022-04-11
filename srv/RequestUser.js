const cds = require('@sap/cds')

module.exports = cds.service.impl(srv => {
    
    // Get date for today
    let today = new Date().toISOString().slice(0, 10)

    srv.on ('getOpenIncidents', _getOpenIncidents)
    srv.on ('getStatusOfIncidentByID', _getStatusOfIncidentByID)

    async function _getOpenIncidents (req) {
        const db = await cds.connect.to('db')
        const { Incident } = db.entities 

        let userInput = req.data
        let openIncidentsFromUser
        let resultArray = []

        if (!userInput.creator) {
            req.error(401, "No user selected!")
        } 
            
        openIncidentsFromUser = SELECT .from `Incident` .where `creator = ${userInput.creator} and status <> 9`
        
        // Execute query
        const query = await cds.run(openIncidentsFromUser)
        
        // Put results into array and return
        query.forEach( item => {
            resultArray.push(item)
        })
        
        return resultArray
    }

    async function _getStatusOfIncidentByID (req) {
        const db = await cds.connect.to('db')
        const { Incident } = db.entities 

        let userInput = req.data
        let statusOfIncident
        let resultArray = []

        if (!userInput.incident_ID) {
            req.error(401, "No ID selected!")
        } 
            
        statusOfIncident = SELECT.one `status`.from `Incident` .where `ID = ${userInput.incident_ID}`
        
        // Execute query
        const status = await cds.run(statusOfIncident)
        
        return status
    }
})