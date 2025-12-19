const cds = require('@sap/cds');
const axios = require('axios');

module.exports = cds.service.impl(async function () {
  const { NorthwindProducts } = this.entities;

  this.on('READ', NorthwindProducts, async (req) => {
    try {
      const northwindCfg = cds.env.requires.Northwind;
      const baseUrl = northwindCfg.credentials.url;

      // Call OData V2 Northwind service
      const response = await axios.get(
        `${baseUrl}/Products?$format=json`
      );

      // OData V2 JSON: { d: { results: [ ... ] } }
      const results = response.data.d.results;

      return results.map((p) => ({
        ProductID: p.ProductID,
        ProductName: p.ProductName,
        QuantityPerUnit: p.QuantityPerUnit,
        UnitPrice: p.UnitPrice,
        UnitsInStock: p.UnitsInStock
      }));
    } catch (err) {
      req.error(500, `Error calling Northwind: ${err.message}`);
    }
  });
});