namespace qpe.cloud;
using { cuid, managed }from '@sap/cds/common';

    // Entity Worker/Responsible of Topics
    entity Responsible : cuid {
        name : String @title:'Responsible name';
        topic : Association to Topic;
    }

    entity Topic : cuid {
        topicArea   : String    @title:'Topic Area';
        issue       : String    @title:'Name';
        responsible : Association to Responsible;
    }

    entity Incident : managed {
        Key ID      : Integer   @title:'Incident ID'; 
        creator     : String    @title:'Created by';
        status     : Integer enum {     
            completed = 9;
            response_needed = 6;
            in_progress = 5;
            new = 0;
        };
        Priority    : Integer enum {
            high = 2;
            normal = 1;
            low = 0;
        };
        title       : String    @title:'Topic';
        message     : String    @title:'Message Content';
        // Estimated completion date (Basierend auf Priorität)
    }


    // 2 Chatbots
    // Funktionen Admin/Responsible:
    // Gib mir alle Tickets pro TopicArea
    

    // Funktionen User:
    // Status von Ticket
    // meine Tickets