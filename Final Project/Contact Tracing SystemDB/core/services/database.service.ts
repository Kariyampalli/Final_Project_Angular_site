import { inject, injectable } from 'inversify';
import { LoggerService } from './logger.service';
import { Connection, r, RConnectionOptions, RDatum } from 'rethinkdb-ts';
import * as databaseConfiguration from '../../configuration/database-config.json';
import { Entry } from '../../models/entry.model';
import { Admin } from '../../models/admin.model';
import { MyResponse } from '../../models/response.model';
import { response } from 'inversify-express-utils';
import { Checking } from '../../models/checking.model';

@injectable()
export class DatabaseService {
  constructor(
    @inject(LoggerService.name) private loggerService: LoggerService
  ) {}



  public async initialize(): Promise<boolean> {
    const connection = await this.connect();
    r.dbList()
      .contains(databaseConfiguration.databaseName)
      .do((containsDatabase: RDatum<boolean>) => {
        return r.branch(
          containsDatabase,
          { created: 0 },
          r.dbCreate(databaseConfiguration.databaseName)
        );
      })
      .run(connection)
      .then(() => {
        this.loggerService.info('Trying to create tables');
        this.createTables(connection)
          .then(() => {
            this.loggerService.info('Tables created');
            return Promise.resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error);
            return Promise.reject(false);
          });
      });
      return Promise.resolve(true);
  }


  public getAllAdmins(): Promise<Array<Admin>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table(databaseConfiguration.databaseTables[1])
          .filter({})
          .run(connection)
          .then((response: Array<Admin>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving admins');
          });
      });
    });
  }

  public getAllCheckings(): Promise<Array<Checking>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table(databaseConfiguration.databaseTables[3])
          .filter({})
          .run(connection)
          .then((response: Array<Checking>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving checkings');
          });
      });
    });
  }

  public getAllInteractions(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table(databaseConfiguration.databaseTables[2])
          .filter({})
          .run(connection)
          .then((response: Array<string>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving interactions');
          });
      });
    });
  }
  
  public getAllEntries(): Promise<Array<Entry>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table(databaseConfiguration.databaseTables[0])
          .filter({})
          .run(connection)
          .then((response: Array<Entry>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving entries');
          });
      });
    });
  }

  public async checkEntry(entry: Entry):Promise<boolean>
  {
    let boolVal = true;
    const entries = await Promise.resolve(this.getAllEntries());
    entries.forEach(e=>{
      if(e.id == entry.id)
      {
        boolVal = false;
      }
    })
    return Promise.resolve(boolVal);
  }

  public async insertEntry(entry:Entry):Promise<boolean>{
    const isValid = await Promise.resolve(this.checkEntry(entry));
    console.log(isValid);
    if(!isValid)
    {
      return Promise.resolve(false);
    }
    else{
      console.log('Inserting caluse');
      const connection = await this.connect();
      return new Promise((resolve) => {
        r.db(databaseConfiguration.databaseName)
          .tableList()
          .contains(databaseConfiguration.databaseTables[0])
          .do(
 r.db(databaseConfiguration.databaseName).table(databaseConfiguration.databaseTables[0]).insert(entry)        
          )
          .run(connection)
          .then(() => {
            this.loggerService.info('Entry inserted' );
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error at entry insertion');
            resolve(false);
          });
      });
    }
  }

  public updateEntry(entryid:string, entry:Entry):Promise<boolean>
  {
   console.log('ADMIN ID:' + entryid);
   return new Promise((resolve, reject) => {
     this.connect().then((connection: Connection) => {
       r.db(databaseConfiguration.databaseName)
         .table(databaseConfiguration.databaseTables[0]).filter({id:entryid}).update(entry)
         .run(connection)
         .then((response: any) => {
           resolve(response);
         })
         .catch((error) => {
           this.loggerService.error(error, 'Error while retrieving entries');
         });
     });
   });
  }

  public async updateAdmin(adminId:string, admin:Admin):Promise<any>
  {
    const validatedAdmin:Admin = {} as Admin;
    validatedAdmin.name = admin.name;
    validatedAdmin.portfolio = admin.portfolio;
    if(admin.password != undefined && admin.password.trim() != null && admin.password.trim().length != 0)
    {
      validatedAdmin.password = admin.password;
    }
   return new Promise((resolve, reject) => {
     this.connect().then((connection: Connection) => {
       r.db(databaseConfiguration.databaseName)
         .table(databaseConfiguration.databaseTables[1]).filter({id:adminId}).update(validatedAdmin)
         .run(connection)
         .then((response: any) => { 
           response.value = true;
           this.loggerService.info('Admin inserted');        
           resolve(response);
         })
         .catch((error) => {
           this.loggerService.error(error, 'Error while updating admin');
           resolve(null);
         });
     });
   });
  }

public async getAnEntry(entryId:string):Promise<MyResponse>
{
  const res:MyResponse = {} as MyResponse;
  res.content = undefined;
  res.status = false;
  return new Promise((resolve, reject) => {
    this.connect().then((connection: Connection) => {
      r.db(databaseConfiguration.databaseName)
      .table(databaseConfiguration.databaseTables[0]).get(entryId)
      .run(connection)
      .then((response: Entry) => {  
        if(response != undefined && response.id == entryId){
          res.content = response;
          res.status = true;
          this.loggerService.info('Entry found');
        }     
        this.loggerService.info('Entry not found'); 
        resolve(res);
      })
        .catch((error) => {
          this.loggerService.error(error, 'Error while retrieving an entry');
        });
    });
  });
}

public async userKeyIsVaild(key:string): Promise<boolean>{
  return new Promise(async (resolve)=>{  
        resolve((await Promise.resolve(this.getAnEntry(key))).status);
  });

}


  public async getAdmin(adminId:string):Promise<MyResponse>
  {
    const res:MyResponse = {} as MyResponse;
    res.content = undefined;
    res.status = false;
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
        .table(databaseConfiguration.databaseTables[1]).get(adminId)
        .run(connection)
        .then((response: Admin) => {  
            response.password = undefined;
            res.content = response;
            res.status = true;
          resolve(res);
        })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving Admin');
            resolve(res);
          });
      });
    });
  }

  public async insertChecking(checking:Checking):Promise<boolean>
  {
      const connection = await this.connect();
      return new Promise((resolve) => {
        r.db(databaseConfiguration.databaseName)
          .tableList()
          .contains(databaseConfiguration.databaseTables[3])
          .do(
         r.db(databaseConfiguration.databaseName).table(databaseConfiguration.databaseTables[3]).insert(checking)        
          )
          .run(connection)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while instering checking');
            resolve(false);
          });
      });
  }

  public async checkAdmin(admin: Admin, isLogin:boolean):Promise<MyResponse>
  {
    const myResponse:MyResponse = {} as MyResponse;
    myResponse.content = undefined;
    myResponse.status = true;
    if(isLogin)
    {
      myResponse.status = false;
    }
    const admins = await Promise.resolve(this.getAllAdmins());
    admins.forEach(a=>{
      if(a.name == admin.name)
      {
        myResponse.status = false;
        if(isLogin && a.password == admin.password)
        {
          myResponse.content = a.id;
          myResponse.status = true;
          this.loggerService.info('Login success');
        }   
      }
    })
    return Promise.resolve(myResponse);
  }

  public async insertAdmin(admin: Admin): Promise<boolean> {
    console.log('Inserting into admins');
    const isValid = await Promise.resolve(this.checkAdmin(admin,false));
    console.log(isValid.status);
    if(!isValid.status)
    {
      return Promise.resolve(false);
    }
    else{
      console.log('Inserting caluse');
      const connection = await this.connect();
      return new Promise((resolve, reject) => {
        r.db(databaseConfiguration.databaseName)
          .tableList()
          .contains(databaseConfiguration.databaseTables[1])
          .do(
 r.db(databaseConfiguration.databaseName).table(databaseConfiguration.databaseTables[1]).insert(admin)        
          )
          .run(connection)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error, 'While inserting admin');
            resolve(false);
          });
      });
    }
  }

  public async insertInteraction(interaction:string):Promise<boolean>{
    const connection = await this.connect();
      return new Promise((resolve, reject) => {
        r.db(databaseConfiguration.databaseName)
          .tableList()
          .contains(databaseConfiguration.databaseTables[2])
          .do(
 r.db(databaseConfiguration.databaseName).table(databaseConfiguration.databaseTables[2]).insert(interaction)        
          )
          .run(connection)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error, 'While inserting interaction');
            reject(false);
          });
      });
  }

  public deleteEntry(entryId:string):Promise<boolean>{
    console.log('entry ID:' + entryId);
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table(databaseConfiguration.databaseTables[0]).filter({id:entryId}).delete()
          .run(connection)
          .then((response: any) => {
            if(response.deleted != 1)
            {
              resolve(false)
            }
            else{
              resolve(true);
            }
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while deleting entries');
          });
      });
    });
  }

  private createTables(connection: Connection): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promises = new Array<Promise<boolean>>();
      databaseConfiguration.databaseTables.forEach((table) => {
        promises.push(this.createTable(connection, table));
      });
      Promise.all(promises)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private createTable(
    connection: Connection,
    tableName: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      r.db(databaseConfiguration.databaseName)
        .tableList()
        .contains(tableName)
        .do((containsTable: RDatum<boolean>) => {
          return r.branch(
            containsTable,
            { create: 0 },
            r.db(databaseConfiguration.databaseName).tableCreate(tableName)
          );
        })
        .run(connection)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private connect(): Promise<Connection> {
    const rethinkDbOptions: RConnectionOptions = {
      host: databaseConfiguration.databaseServer,
      port: databaseConfiguration.databasePort,
    };
    return new Promise((resolve, reject) => {
      r.connect(rethinkDbOptions)
        .then((connection: Connection) => {
          resolve(connection);
        })
        .catch(reject);
    });
  }
}
