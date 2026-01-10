

using { po.ust as ust } from '../db/schema';

@path : '/aud'
service AUDService {

  @Common.Label : 'PO Audit Log'
  @(odata.draft.enabled: true)
  entity POAudits as projection on ust.audit;


}
