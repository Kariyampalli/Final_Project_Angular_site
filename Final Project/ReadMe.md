# Contact Tracing System

## Running the application
*First, you need to execute the database in cmd (path has to be the folder-path of rethinkdb.exe) with the command: rethinkdb*
*If this doesn't work, try to bind it to a different port : rethinkdb --bind all --http-port 89*

*After the database is successfully runnning. You need start the server (Contact Tracing SystemDB) in the visual studio code terminal with: ts-node index.ts*

*After server is successfully running. You have to start the angular application in the terminal with: npm start*
**(since we are using a proxy)**

**Now the Angular application should be set up and running.**

# !BITTE LESEN! --> Wichtig für die Abgabe
ESLint wirft bei mir einen Fehler und zwar das er die tsconfig.json Datei beim '@angular' import nicht parsen kann. Ich hab mein Bestes versucht dies zu beheben. Ich hab 1 zu 1 das nachgemacht wie in der Vorlesung und stundenlang online recherchiert, es hat nichts funktioniert. Der Fehler wurde aus irgendeinem Grund nicht behoben oder wurde schlimmer.
Aller andern Syntax Fehler usw. sind jedoch behoben, also per ng lint sollten keine Fehler auftretten.