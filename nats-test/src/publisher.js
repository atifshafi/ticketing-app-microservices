// This script is for consumers (services which are going to consume messages once event bus broadcasts/publishes them)
import nats from 'node-nats-streaming';

// Better name would be 'client'. 'stan' is used in the module to refer clients
// Publishers will connect to the event bus using 'node port' forwarding (not via nginx like other services do). This due to the complexity it creates when there's a connection  issue between services and the event bus.
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    // NATS Streaming service only processes string
    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    // Publishing the message
    stan.publish('ticket:created', data, () => {
        console.log('Event published');
    });
});