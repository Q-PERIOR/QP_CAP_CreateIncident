namespace qpe.cloud;
using { cuid, managed }from '@sap/cds/common';

    // Entity Worker/Responsible of Topics
    entity Responsible {
        key ID  : Integer   @title:'Responsible ID';
        name    : String    @title:'Responsible name';
        topic   : Association to Topic;
    }

    entity Topic {
        key ID      : Integer   @title:'Topic ID';
        topicName   : String    @title:'Topic Area';
        responsible : Association to Responsible;
    }

    entity Incident : cuid, managed {
        //Key ID      : Integer   @title:'Incident ID'; 
        creator     : String    @title:'Created by';
        topic       : Association to Topic;
        responsible : Association to Responsible;
        status      : Integer enum {     
            completed = 9;
            response_needed = 6;
            in_progress = 5;
            new = 0;
        };
        priority    : Integer enum {
            high = 2;
            normal = 1;
            low = 0;
        };
        title       : String    @title:'Topic';
        message     : String    @title:'Message Content';
    }
