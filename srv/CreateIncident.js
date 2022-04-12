const cds = require('@sap/cds')

const User = new class extends cds.User {}

module.exports = cds.service.impl(srv => {
    const { Incident, Responsible } = srv.entities ('qpe.cloud')

    srv.before ('CREATE', 'Incident', _checkIncident)
    srv.before ('CREATE', 'Incident', _formatData)


    async function _formatData (req) {
        const userInput = req.data

        // Select all available desks
        if (!userInput.creator) {
            req.error(401, "No user selected!")
        } 
            
                
        /* Set user*/
        req.user.id = userInput.creator;

        /* Get responsible for topic */
        let responsibleIDFromTopic
        
        responsibleIDFromTopic = SELECT.one `ID` .from `Responsible` .where `topic_ID = ${userInput.topic_ID}`
        
        // Execute query
        const responsible = await cds.run(responsibleIDFromTopic)
        userInput.responsible_ID = responsible.ID;

        /* Set priority to normal*/
        if (!userInput.priority) {
            userInput.priority = 1;
        }

        /* Set status to new */
        if (!userInput.status) {
            userInput.status = 0;
        }
    }


    async function _checkIncident (req) {
        const userInput = req.data

        /* Check user input */
        if (!userInput.creator) {
            req.error(401, "No creator found!")
        }
        if (!userInput.topic_ID) {
            req.error(402, "No topic selected!")
        }
        
        if (!userInput.title) {
            req.error(403, "Missing title!")
        }

        if (!userInput.message) {
            req.error(404, "Missing message")
        }
    }
}) 
