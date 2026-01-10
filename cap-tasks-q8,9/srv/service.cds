using { cuid } from '@sap/cds/common';

service TaskService {
  entity Tasks : cuid {
    title     : String(111);
    completed : Boolean;
    priority  : String(20);
  }

  action completeTask(ID : UUID) returns Tasks;
}