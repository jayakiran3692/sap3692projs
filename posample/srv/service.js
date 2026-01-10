const cds = require('@sap/cds');
 
module.exports = cds.service.impl(async function () {
 
  const { POHeaders, POItems } = this.entities;
  const config = { threshold: 100000 };
 
 
  const validateRegex = (value, pattern, msg) => {
    if (value && !(new RegExp(pattern).test(value))) {
      throw new Error(msg);
    }
  };
 
  const validateRange = (value, min, max, msg) => {
    if (value < min || value > max) {
      throw new Error(msg);
    }
  };
 
 
  this.before('CREATE', POHeaders, async (req) => {
    const h = req.data;
 
    //Auto-generate PO Number if missing
    if (!h.poNumber) {
      h.poNumber = `PO/${String(Date.now()).slice(-6)}/${new Date().getFullYear()}`;
    }
 
    //Validate poNumber
    validateRegex(
      h.poNumber,
      '^[A-Z0-9/-]{1,20}$',
      'PO Number must contain uppercase alphanumeric characters, / or -'
    );
 
    //Validate vendor
    validateRegex(
      h.vendor,
      '^[A-Z0-9]{6,10}$',
      'Vendor must be 6–10 characters long and alphanumeric'
    );
 
    //Validate company code
    validateRegex(
      h.companyCode,
      '^[0-9]{4}$',
      'Company Code must be exactly 4 digits'
    );
 
    //Validate purchasing org
    validateRegex(
      h.purchasingOrg,
      '^[0-9]{4}$',
      'Purchasing Organization must be exactly 4 digits'
    );
 
    //Validate currency
    if (!['INR', 'USD', 'EUR'].includes(h.currency)) {
      req.error(400, 'Currency must be INR, USD, or EUR');
    }
 
    //Validate dates
    if (h.documentDate) {
      validateRegex(
        h.documentDate,
        '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
        'Document date must be YYYY-MM-DD'
      );
    }
 
    if (h.deliveryDate) {
      validateRegex(
        h.deliveryDate,
        '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
        'Delivery date must be YYYY-MM-DD'
      );
 
      if (new Date(h.deliveryDate) < new Date(h.documentDate)) {
        req.error(409, 'Delivery date cannot be before document date');
      }
    }
 
    // Validate payment terms
    validateRegex(
      h.paymentTerms,
      '^[A-Z0-9]{3,10}$',
      'Payment Terms must be 3–10 alphanumeric characters'
    );
 
    //Validate remarks length
    if (h.remarks && h.remarks.length > 500) {
      req.error(400, 'Remarks cannot exceed 500 characters');
    }
 
    // Validate items exist
    // Allow empty items during draft creation
 
if (req.data.IsActiveEntity === true) {
 
  if (!h.items || h.items.length === 0) {
 
    req.error(400, 'A PO must contain at least one item');
 
  }
 
}
 
 
    // Validate items and calculate total
    let total = 0;
 
    h.items.forEach((it, index) => {
 
      // line-level schema validations
      validateRegex(it.material, '^[A-Z0-9/]{1,18}$', `Item ${index + 1}: Invalid material`);
      validateRegex(it.description, '^.{1,100}$', `Item ${index + 1}: Description must be 1–100 characters`);
 
      validateRange(it.orderedQty, 0.001, 999999.999, `Item ${index + 1}: Invalid ordered quantity`);
      validateRange(it.netPrice, 0.01, 999999.99, `Item ${index + 1}: Invalid net price`);
      validateRange(it.discountPct ?? 0, 0, 100, `Item ${index + 1}: Invalid discount`);
      validateRange(it.gstPct ?? 0, 0, 28, `Item ${index + 1}: Invalid GST%`);
 
      // Calculate totals
      const disc = it.discountPct || 0;
      const lineValue = it.orderedQty * it.netPrice * (1 - disc / 100);
 
      it.lineItemNetValue = Math.round(lineValue * 100) / 100;
      it.openQty = it.orderedQty;
 
      total += it.lineItemNetValue;
    });
 
    h.totalPOValue = Math.round(total * 100) / 100;
  });
 
 
  this.after('CREATE', POHeaders, async (data, req) => {
    if (data.totalPOValue <= config.threshold) {
      await UPDATE(POHeaders).set({ status: 'Approved' }).where({ ID: data.ID });
      req.info(`PO ${data.poNumber} auto-approved`);
    }
  });
 
 
  this.on('SUBMIT', POHeaders, async (req) => {
    const { ID } = req.data;
    const po = await SELECT.one.from(POHeaders).where({ ID });
 
    if (!po) req.error(404, 'PO not found');
    if (po.status !== 'Draft') req.error(400, 'Only Draft POs can be submitted');
 
    if (po.totalPOValue <= config.threshold) {
      await UPDATE(POHeaders).set({ status: 'Approved' }).where({ ID });
      return { status: 'Approved', message: 'PO auto-approved' };
    }
 
    await UPDATE(POHeaders).set({ status: 'Submitted' }).where({ ID });
 
    return { status: 'Submitted', message: 'PO submitted for approval' };
  });
 
  this.on('APPROVE', POHeaders, async (req) => {
    const { ID } = req.data;
    await UPDATE(POHeaders).set({
      status: 'Approved',
      approvedBy: req.user.id,
      approvedAt: new Date()
    }).where({ ID });
 
    return { message: 'PO approved successfully' };
  });
 
  this.on('REJECT', POHeaders, async (req) => {
    const { ID, rejectReason } = req.data;
 
    if (!rejectReason) req.error(400, 'Reject reason is mandatory');
 
    await UPDATE(POHeaders).set({
      status: 'Rejected',
      remarks: rejectReason
    }).where({ ID });
 
    return { message: 'PO rejected successfully' };
  });
 
  this.before('CREATE', POItems, async (req) => {
    const it = req.data;
 
    validateRange(it.orderedQty, 0.001, 999999.999, 'Ordered Qty must be > 0');
    validateRange(it.netPrice, 0.01, 999999.99, 'Net Price must be > 0');
 
    // Calculate line values
    const disc = it.discountPct || 0;
    it.lineItemNetValue = Math.round((it.orderedQty * it.netPrice * (1 - disc / 100)) * 100) / 100;
 
    it.openQty = it.orderedQty;
  });
 
 
   //PREVENT ITEM UPDATE IF PO APPROVED
   
  this.before('UPDATE', POItems, async (req) => {
    const { ID } = req.data;
 
    const existing = await SELECT.one.from(POItems).where({ ID });
    if (!existing) req.error(404, 'Item not found');
 
    const parent = await SELECT.one.from(POHeaders).where({ ID: existing.poHeader_ID });
 
    if (parent.status === 'Approved') {
      if (req.data.orderedQty || req.data.netPrice) {
        req.error(409, 'Cannot modify quantity or price after PO approval');
      }
    }
  });
 
   //RECALCULATE HEADER TOTAL WHEN ITEM CHANGES
 
  this.after(['CREATE', 'UPDATE', 'DELETE'], POItems, async (_, req) => {
    const item = req.data;
    const poId = item.poHeader_ID;
 
    const allItems = await SELECT.from(POItems).where({ poHeader_ID: poId });
    const total = allItems.reduce((s, i) => s + (i.lineItemNetValue || 0), 0);
 
    await UPDATE(POHeaders).set({ totalPOValue: total }).where({ ID: poId });
  });
});
