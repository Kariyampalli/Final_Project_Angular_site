import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { LoggerService } from '../services/logger.service';
import { DatabaseService } from '../services/database.service';
import { EntriesController } from '../../events/entries.controller';
import { AdminsController } from '../../events/admins.controller';
import { InteractionsController } from '../../events/interactions.controller';
import { UsersController } from '../../events/users.controller';

export class IoContainer {
  private container = new Container();

  public init(): void {
    this.initServices();
    this.initController();
  }

  public getContainer(): Container {
    return this.container;
  }

  private initController(): void {
    this.container.bind<interfaces.Controller>(TYPE.Controller)
    .to(EntriesController)
    .whenTargetNamed(EntriesController.name);

    this.container.bind<interfaces.Controller>(TYPE.Controller)
    .to(AdminsController)
    .whenTargetNamed(AdminsController.name);

    this.container.bind<interfaces.Controller>(TYPE.Controller)
    .to(UsersController)
    .whenTargetNamed(UsersController.name);

    this.container.bind<interfaces.Controller>(TYPE.Controller)
    .to(InteractionsController)
    .whenTargetNamed(InteractionsController.name);
  }

  private initServices(): void {
    this.container
      .bind<LoggerService>(LoggerService.name)
      .to(LoggerService)
      .inSingletonScope();
      this.container
      .bind<DatabaseService>(DatabaseService.name)
      .to(DatabaseService)
      .inSingletonScope();
  }
}
