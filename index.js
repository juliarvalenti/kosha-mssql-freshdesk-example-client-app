const { program } = require('commander')
const axios = require('axios')

// ##################################################
// ||                                              ||
// ||                    SET UP                    ||
// ||                                              ||
// ##################################################

// Defining constants
const koshaAPIToken = 'eyJhbGciOiJSUzI1NiIsImlzcyI6Imtvc2hhQGV0aS5jaXNjby5jb20iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrb3NoYS1jb25uZWN0b3JzIiwiZXhwIjoxNjYwNjY3OTEwLCJqdGkiOiIyNGU5MjZlYy04YTk2LTQ0YzMtOGZjMy0xZmMyNThiY2Q5ZTIiLCJpYXQiOjE2NjAwNjMxMTAsImlzcyI6Imtvc2hhQGV0aS5jaXNjby5jb20iLCJzdWIiOiJqdWxpYXZAYWNtZWNvcnAuY29tIiwicGF5bG9hZCI6e319.b4C3Bs6WRN6Mr7uTFd9vxdZtx_CLdFhYSXthgtjyLMcYbxTX0YYJn_tK4EQMWqx9hElviPGvtYXIz4MmbTSGd3ixgl2qQRcsO1gNChf-SJ1meHS-NRVcNzxY4Xa001lLyYmQkR9o5XbWxjT6TDwLJzo-I7PTFnokwRVaQ5S2t71JCFDY6v9WTKA80FcQ2OufMWSiMCmPADBIaAg5NiOro4BMi3LowafpaNPKiTUqwbxBDn8-C0siFzR36xCQegXHgYDNhQrYrpeFAx06BWTKsrlG_H6ZKIiVk6h-fIEYbdbVJyONZa46qUtD_pGr0R0C6G6-XJPtQqmAsT77ypbU5Q'
const mssqlTable = 'dbo.tickets'
const mssqlKoshaEndpoint = `https://mssql-video-demo.acmecorp.appn.cloud/api/v1/query/raw/sql`
const freshdeskKoshaEndpoint = 'https://freshdesk-video-demo.acmecorp.appn.cloud/api/v1/tickets'

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
    const query = `INSERT into ${mssqlTable} (id, priority, status, subject) VALUES ${tickets.map(ticket => `(${ticket.id}, '${removeQuotes(ticket.priority)}', '${removeQuotes(ticket.status)}', '${removeQuotes(ticket.subject)}')`)}`
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