const { program } = require('commander')
const axios = require('axios')

// ##################################################
// ||                                              ||
// ||                    SET UP                    ||
// ||                                              ||
// ##################################################

// Defining constants
const koshaAPIToken = 'eyJhbGciOiJSUzI1NiIsImlzcyI6Imtvc2hhQGV0aS5jaXNjby5jb20iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrb3NoYS1jb25uZWN0b3JzIiwiZXhwIjoxNjYwNzU1NTAzLCJqdGkiOiI4M2QwNTU4NS03OTY2LTQ1MjgtOWI5Yy04NTAzOTE0NWU0ZGQiLCJpYXQiOjE2NjAxNTA3MDMsImlzcyI6Imtvc2hhQGV0aS5jaXNjby5jb20iLCJzdWIiOiJqdWxpYXZAdHJpYWxydW4uY29tIiwicGF5bG9hZCI6e319.KY7C7b3QNPoe5B3PoOxEsBhIN2Sbb0X7AQbl7gwsIo4TCvyH1vSoCRLzXgZd6nHcVXTnZMcYfkZ6JIzVHaV7kb0TotmlGRIdFPmPgPkab7gykNsF74Jy0FCYZeOVAsrVL7y-orVf1rP-Mg4mZ443mg_gFF-ISDWfKFI224tM4LaYGD__Ql9JIbc3QuYi3meuLIE5f4rgZB83xXGc_d0RaM6k3W_mGEDoGnvqcltTOBaSTTbkUDNwx6uRrkvbIs0SqhxKKLpNS13zc3ZfQT5l0UuvHFER9h8DlDLIBeNTIq0ZkMwhtjTPYAfgikprUKbirQApbjgdXH-XBP4qe1AnkA'
const mssqlTable = 'dbo.tickets'
const mssqlKoshaEndpoint = `https://mssql-for-client-app.kosha-trial-run-test-org.dev.kosha.app/api/v1/${mssqlTable}/query`
const freshdeskKoshaEndpoint = 'https://freshdesk-for-client-app.kosha-trial-run-test-org.dev.kosha.app/api/v1/tickets'

// Setting up axios, a utility for fetching resources off the web
const fetcher = axios.create()

// Use Axios to apply our Kosha token as an authorization header to all requests
fetcher.interceptors.request.use(async (config) => {
  if (config.headers) config.headers = { ...config.headers, Authorization: `Bearer ${koshaAPIToken}` }
  return config
})

// Instatiating our command line program
program
  .name('FreshDesk MSSQL Example Application')
  .description('An example application showing how to connect FreshDesk to MSSQL using Kosha.')
  .version('1.0.0');


// Utility function to remove quotes from the data that comes from FreshDesk
// We're building a SQL query in a hacky way, so this is just a helper function
// to ensure that queries don't break
const removeQuotes = str => str.replace(/[\\"']/g, '').replace(/\u0000/g, '');

// ##################################################
// ||                                              ||
// ||                   COMMANDS                   ||
// ||                                              ||
// ##################################################

program.command('fetch-freshdesk')
  .description('Fetch data from FreshDesk')
  .action(async () => {
    console.log('Fetching data from FreshDesk')

    const result = await fetcher.get(freshdeskKoshaEndpoint).then(resp => resp.data)

    console.log('Result from FreshDesk', result)
  });

program.command('fetch-mssql')
  .description('Fetch data from MSSQL')
  .action(async () => {
    console.log('Fetching data from MSSQL')

    // Build SQL payload & display result
    const query = `select * from ${mssqlTable}`
    const payload = { 'raw_sql': query }

    const result = await fetcher.post(mssqlKoshaEndpoint, payload).then(resp => resp.data)

    console.log("Result from MSSQL", result)
  });

program.command('fetch-and-store')
  .description('Fetch data from FreshDesk and store in MSSQL')
  .action(async () => {
    console.log('Fetching data from FreshDesk')

    // Build SQL payload & display result
    const tickets = await fetcher.get(freshdeskKoshaEndpoint).then(resp => resp.data)
    const query = `INSERT into ${mssqlTable}(id, priority, status, subject) VALUES ${tickets.map(ticket => `(${ticket.id}, '${removeQuotes(ticket.priority)}', '${removeQuotes(ticket.status)}', '${removeQuotes(ticket.subject)}')`)}`
    const payload = { 'raw_sql': query }

    const result = await fetcher.post(mssqlKoshaEndpoint, payload).then(resp => resp.data)

    console.log('Result from MSSQL', result)
  })

program.command('cleanup-mssql')
  .description('Clean up data in MSSQL')
  .action(async () => {
    console.log('Cleaning up data in MSSQL')

    const query = `delete from ${mssqlTable}`
    const payload = { 'raw_sql': query }

    const result = await fetcher.post(mssqlKoshaEndpoint, payload).then(resp => resp.data)

    console.log('Result from MSSQL', result)
  })

program.parse();