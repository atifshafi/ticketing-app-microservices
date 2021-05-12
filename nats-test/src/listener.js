// This script is for producers (services which are going to produce messages and, then, event bus will consume/store it)
import nats from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import {TicketCreatedListener} from './events/ticket-created-listener.js'

// Better name would be 'client'. 'stan' is used in the module to refer clients
// Publishers will connect to the event bus using 'node port' forwarding (not via nginx like other services do). This due to the complexity it creates when there's a connection  issue between services and the event bus.
const stan = nats.connect('ticketing', randomBytes(20).toString('hex'), {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // Gracefully close/disconnect client
    stan.on('close', () => {
        console.log('NAT connection closed!');
        process.exit();
    });

    // Call the listener class to start listening
    new TicketCreatedListener(stan).listen();

});

// When the process is manually closed/interrupted. It will make sure the process closes the client first
// It makes sure when a process is killed, it's acknowledged by the event bus immediately - verify in: http://localhost:8222/streaming/channelsz?subs=1 (NATS Streaming debug online  tool)
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




