const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
module.exports = async function() {
    const {vendor} = this.entities;
    const bpa = await cds.connect.to('bpa');
    this.on("trigger", async req =>{
        const {VendorID} = req.params[0];
        console.log(VendorID);
        const order = await SELECT.one.from(vendor).where({VendorID});
        console.log(order);

        const payload = {
           
    "definitionId": "us10.6c7d2334trial.vendorinvoiceapprovalprocess.invoiceApprovalProcess",
    "context": {
        "inv_dt": {
            "Name": order.Name,
            "Amount": Number(order.Amount),
            "VendorID": order.VendorID,
            "SubmittedBy": order.SubmittedBy
        }
    }
}
 
    console.log(payload);
    const response = await bpa.send({
        method: 'POST',
        path:'/workflow/rest/v1/workflow-instances',
        data:payload
    })
    console.log(response);
 
    })
}
 