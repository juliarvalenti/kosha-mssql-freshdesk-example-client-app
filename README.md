# freshdesk-mssql-example-app

Example application demonstrating capabilities of Kosha for the Macomb County design partner.

## Requirements:

[NodeJS](https://nodejs.org/en/)

## Usage & Demo

### 1. Fetch data from FreshDesk and display in terminal

```
$ node index.js fetch-freshdesk
Fetching data from FreshDesk
Result from FreshDesk [
  {
    fr_escalated: true,
    group_id: 101000358065,
    priority: 'high',
    requester_id: 101054544329,
    ...
]
```

### 2. Fetch data from MSSQL and display in terminal

```
$ node index.js fetch-mssql
Fetching data from MSSQL
Result from MSSQL []
```

### 3. Fetch data from FreshDesk and insert into MSSQL

```
$ node index.js fetch-and-store
Fetching data from FreshDesk
Result from MSSQL OK
```

### 4. Fetch data from MSSQL and display in terminal again

Shows that data has been successfully parsed and stored into MSSQL

```
$ node index.js fetch-mssql
Fetching data from MSSQL
Result from MSSQL [
  {
    id: 73,
    subject: 'Duplicate User Issues',
    priority: 'high',
    status: 'open'
  },
  {...
]
```

### 5. Clean up MSSQL database

```
$ node index.js cleanup-mssql
Cleaning up data in MSSQL
Result from MSSQL OK
```

### Display commands

```
$ node index.js help
Usage: FreshDesk MSSQL Example Application [options] [command]

An example application showing how to connect FreshDesk to MSSQL using Kosha.

Options:
  -V, --version    output the version number
  -h, --help       display help for command

Commands:
  fetch-freshdesk  Fetch data from FreshDesk
  fetch-mssql      Fetch data from MSSQL
  fetch-and-store  Fetch data from FreshDesk and store in MSSQL
  cleanup-mssql    Clean up data in MSSQL
  help [command]   display help for command
```
