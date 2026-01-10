using { cuid } from '@sap/cds/common';

@cds.external
service API_SALES_ORDER_SRV {
  entity A_SalesOrder {
    key SalesOrder      : String(10);
        SalesOrderType  : String(4);
        SalesOrganization : String(4);
        TotalNetAmount  : Decimal(15,2);
        TransactionCurrency : String(5);
        SoldToParty     : String(10);
  }
}