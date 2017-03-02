# Texas OnCourse Message Queue API

Simple RESTful API for sending messages to the Message Queue.

The API is not available unless the user provides their ID and key combination through a Basic Auth header. The API is used through HTTPS.

Current implementation lies at: https://oidc.tex.extensionengine.com/mq/api

## Routes

### GET /api/

Displays the documentation.

### POST /api/topics/:topic_name
           
Receives a JSON body containing a message to be passed to the Message Queue.

##### Parameters

topic_name - Topic of the message.

### POST /api/envelopes

Receives a JSON body with the Caliper standard (envelope)[http://www.imsglobal.org/caliper/caliperv1p0/ims-caliper-analytics-best-practice-guide#3.6]. The important part is the data array, which will be parsed and all events in it emitted to the backend.