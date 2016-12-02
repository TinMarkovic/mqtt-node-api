# Texas OnCourse Message Queue API

Simple RESTful API for sending messages to the Message Queue.

## Routes

### GET /api/

Displays the documentation.

### GET /api/topics/

Displays a list of Message Queue topics available. Currently undefined.

### POST /api/topics/:topic_name
           
Receives a JSON body containing a message to be passed to the Message Queue.

##### Parameters

topic_name - Topic of the message.