import { Agenda } from '@hokify/agenda'

const mongoConnectionString = "mongodb://127.0.0.1:27017/agenda-test"
const agenda = new Agenda({ db : { address : mongoConnectionString, collection : "agenda" } })

agenda.define('fetch_user_namee', async job => {
    const response = await fetch("https://reqres.in/api/users/2", { method: "GET" })
    const data = await response.json()
    const user = await data.data

    console.log(`${user.first_name}`);
});


(async () => {   
    agenda
        .on('ready', () => console.log("Agenda started!"))
        .on('error', () => console.log("Agenda connection error!"));
    await agenda.start();
    await agenda.every("5 second", "fetch_user_namee");
})();