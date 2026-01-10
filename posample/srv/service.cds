using { po.ust as ust } from '../db/schema';

service POService {

  @odata.draft.enabled
  entity POHeaders as projection on ust.POHeader;

  entity POItems   as projection on ust.POItem;

}