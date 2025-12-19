using { cuid, managed } from '@sap/cds/common';

namespace my.so;

entity SalesOrderHeader : cuid, managed {
  key SalesOrderID : String(10);
  CustomerName     : String(60);
  OrderDate        : Date;
  TotalAmount      : Decimal(15, 2);

  // Composition of items
  items : Composition of many SalesOrderItem
    on items.header = $self;
}

entity SalesOrderItem : cuid, managed {
  key ItemID      : Integer;
  header          : Association to SalesOrderHeader;

  ProductID       : String(20);
  ProductName     : String(60);
  Quantity        : Integer;
  UnitPrice       : Decimal(11, 2);
  NetAmount       : Decimal(15, 2);

  // Association example: could be to some master data
  parentHeader    : Association to SalesOrderHeader
    on parentHeader.SalesOrderID = header.SalesOrderID;
}