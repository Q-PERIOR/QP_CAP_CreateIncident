const cds = require("@sap/cds");

module.exports = cds.service.impl((srv) => {

    const { Incident, Responsible } = srv.entities ('qpe.cloud')

  // Get date for today
  let today = new Date().toISOString().slice(0, 10);

  srv.on("getOpenIncidents", _getOpenIncidents);
  srv.on("getStatusOfIncidentByID", _getStatusOfIncidentByID);
  srv.on("createIncident", _createIncident);

  async function _getOpenIncidents(req) {
    const db = await cds.connect.to("db");
    const { Incident } = db.entities;

    let userInput = req.data;
    let openIncidentsFromUser;
    let resultArray = [];

    if (!userInput.creator) {
      req.error(401, "No user selected!");
    }

    openIncidentsFromUser = SELECT.from`Incident`
      .where`creator = ${userInput.creator} and status <> 9`;

    // Execute query
    const query = await cds.run(openIncidentsFromUser);

    // Put results into array and return
    query.forEach((item) => {
      resultArray.push(item);
    });

    return resultArray;
  }

  async function _getStatusOfIncidentByID(req) {
    const db = await cds.connect.to("db");
    const { Incident } = db.entities;

    let userInput = req.data;
    let statusOfIncident;
    let resultArray = [];

    if (!userInput.incident_ID) {
      req.error(401, "No ID selected!");
    }

    statusOfIncident = SELECT.one`status`.from`Incident`
      .where`ID = ${userInput.incident_ID}`;

    // Execute query
    const status = await cds.run(statusOfIncident);

    return status;
  }

  async function _createIncident(req) {
    let errorOccured = false;
    let message;
    let query_topic_ID;
    let query_responsible_ID;
    const userInput = req.data;

    /****  Check Input   ****/
    /* Check user input and get necessary data*/
    if (!userInput.creator) {
      req.error(401, "No creator found!");
      errorOccured = true;
    }
    if (!userInput.topicName) {
      req.error(402, "No topic selected!");
      errorOccured = true;
    } else {
        query_topic_ID = SELECT.one`ID`.from`Topic`
        .where`topicName = ${userInput.topicName}`;
        userInput.topic = await cds.run(query_topic_ID);
    }

    if (!userInput.topic.ID) {
        req.error(405, "Topic ID not found!");
        errorOccured = true;
      } else {
        query_responsible_ID = SELECT.one`ID` .from `Responsible`.where`topic_ID = ${userInput.topic.ID}`;
        userInput.responsible = await cds.run(query_responsible_ID);
      }

    if (!userInput.title) {
      req.error(403, "Missing title!");
      errorOccured = true;
    }

    if (!userInput.message) {
      req.error(404, "Missing message");
      errorOccured = true;
    }

    /****  Format data and create incident  ****/

    if (errorOccured == false) {
      /* Set user*/
      req.user.id = userInput.creator;

      /* Set priority to normal*/
      if (!userInput.priority) {
        userInput.priority = 1;
      }

      /* Set status to new */
      if (!userInput.status) {
        userInput.status = 0;
      }

      /* Book Table */
      await cds
        .transaction(req)
        .run(
          INSERT.into(Incident, {
            creator: userInput.creator,
            topic_ID: userInput.topic.ID,
            responsible_ID: userInput.responsible.ID,
            priority: userInput.priority,
            title: userInput.title,
            message: userInput.message,
            status: userInput.status
          })
        );
      message = "Ticket wurde erfolgreich erstellt.";
      return message;
    }
  }
});
