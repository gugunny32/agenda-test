import { Agenda } from '@hokify/agenda'
import { Server } from '@hapi/hapi';
import inert from '@hapi/inert';
import Agendash from 'agendash';


const server = new Server({
    port: 3002,
    host: "localhost",
})

const agenda = new Agenda()
    .database("mongodb://127.0.0.1:27017/agenda-test", "agendaJobs")

// (async () => {   
//     agenda
//         .on('ready', () => console.log("Agenda started!"))
//         .on('error', () => console.log("Agenda connection error!"));
//     await agenda.start();
//     await agenda.every("5 second", "test-logs5");
// })();

await server.register(inert);
await server.register(
    Agendash(agenda, {
        middleware: "hapi",
    })
);

await server.start();