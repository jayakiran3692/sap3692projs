using { my.so as so } from '../db/schema';
using { API_SALES_ORDER_SRV as s4 } from './external/API_SALES_ORDER_SRV';

service CatalogService {


  entity Orders as projection on so.SalesOrderHeader;
  entity OrderItems as projection on so.SalesOrderItem;


  @readonly
  entity ExternalSalesOrders as projection on s4.A_SalesOrder;


  @readonly
  entity NorthwindProducts {
    key ProductID       : Integer;
        ProductName     : String(100);
        QuantityPerUnit : String(100);
        UnitPrice       : Decimal(11,2);
        UnitsInStock    : Integer;
  }

  @readonly
  function GetNorthwindProducts() returns many NorthwindProducts;
}