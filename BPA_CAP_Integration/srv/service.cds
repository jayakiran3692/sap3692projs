using db from '../db/schema';

service VendorService {
@odata.draft.enabled : true

entity vendor as projection on db.vendor{*}
actions{
    action trigger() returns String;
}
};
