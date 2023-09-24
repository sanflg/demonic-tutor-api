# Demonic-Tutor-API

## Env variables:
Add envVars.js file in root with structure:

```
const envVars = {
  db: {
    host: '',
    user: '',
    database: '',
    password: ''
  },
  port: 1111
};

module.exports = envVars;
```

## For nodemon on debbuging
1) Run ```npm install -g nodemon```. Installd globaly so any terminal can recognize the command on any context.
2) go to ```.vscode>launch.json``` and following code.
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}\\app.js",
            "restart": true,
            "runtimeExecutable": "nodemon",
            "console": "integratedTerminal"
        }
    ]
}
```

## Useful Commands:
* ```npm install -g [name]``` --> will install globally on local
* ```npm install [name] --save-dev``` -->will install as dev dependency and will not run in dev
* ```npm install [name] --save``` -->will install as prod dependency
* ```npm start``` ---> runs the start command in package.json file to start the project

## Event Loop:
1) Timers (setTimeout/setInterval)
2) Pending callbacks (pending i/o)
3) Poll (new i/o)
4) Check (execute setImmediate)
5) close callbacks
6) process.exit