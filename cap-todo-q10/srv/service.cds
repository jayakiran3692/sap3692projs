using { todo as db } from '../db/schema';

service TodoService {
  entity Tasks as projection on db.Tasks;
  action markAllDone();
}