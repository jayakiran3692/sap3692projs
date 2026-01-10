namespace db;

entity vendor {
    key VendorID : String;
    Name : String;
    Amount : Decimal(10,2);
    SubmittedBy : String;
}