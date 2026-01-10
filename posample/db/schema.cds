namespace po.ust;

using { cuid, managed, User } from '@sap/cds/common';

aspect primary : managed, cuid {}

type Status : String enum {
  Draft;
  Submitted;
  Approved;
  Rejected;
  Closed;
  Cancelled;
}

type Currency : String(3) enum {
  INR;
  USD;
  EUR;
}

entity POHeader : primary {
  key ID           : UUID;
  poNumber         : String(20) @assert.format: '^[A-Z0-9/-]{1,20}$';
  vendor           : String(10) @assert.format: '^[A-Z0-9]{6,10}$';
  companyCode      : String(4)  @assert.format: '^[0-9]{4}$';
  purchasingOrg    : String(4)  @assert.format: '^[0-9]{4}$';
  currency         : Currency   default 'INR';
  documentDate     : Date       @assert.format: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';
  deliveryDate     : Date       @assert.format: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';
  paymentTerms     : String(10) @assert.format: '^[A-Z0-9]{3,10}$';
  totalPOValue     : Decimal(15,2) @assert.range: [0.00, 999999999.99];
  status           : Status     default #Draft;
  remarks          : String(500);

  // 👇 navigation/composition to items is called POItems
  POItems : Composition[1..*] of POItem
              on POItems.poHeader = $self;
}

entity POItem : primary {
  key ID              : UUID;
  poHeader            : Association to POHeader;

  lineItemNo          : Integer       @assert.range: [1, 999];
  material            : String(18)    @assert.format: '^[A-Z0-9/]{1,18}$';
  description         : String(100)   @assert.format: '^.{1,100}$';
  orderedQty          : Decimal(13,3) @assert.range: [0.001, 999999.999];
  uom                 : String(3)     @assert.format: '^[A-Z0-9]{1,3}$';
  netPrice            : Decimal(15,2) @assert.range: [0.01, 999999.99];
  discountPct         : Decimal(5,2)  @assert.range: [0.00, 100.00];
  gstPct              : Decimal(5,2)  @assert.range: [0.00, 28.00];
  lineItemNetValue    : Decimal(15,2);
  receivedQty         : Decimal(13,3) default 0.0;
  openQty             : Decimal(13,3);
  status              : String(20)    default 'Open';
  internalRemarks     : String(255);
}