sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.ust.po.posample.controller.View1", {

        onInit: function () {
            // nothing yet
        },

        // fired when user clicks a row (itemPress of the Table)
        onPOPress: function (oEvent) {
            // from itemPress we get listItem parameter
            var oItem = oEvent.getParameter("listItem");
            if (!oItem) {
                oItem = oEvent.getSource();
            }

            var oCtx = oItem.getBindingContext();
            if (!oCtx) {
                return;
            }

            var sPath = oCtx.getPath();      // "/POHeaders(ID=...,IsActiveEntity=true)"
            var sNoSlash = sPath.substring(1); // "POHeaders(ID=...,IsActiveEntity=true)"

            // no encoding needed because pattern has {path*}
            this.getOwnerComponent().getRouter().navTo("Detail", {
                path: sNoSlash
            });
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || "";
            var oTable = this.byId("poTable");
            var oBinding = oTable.getBinding("items");

            if (!oBinding) {
                return;
            }

            if (!sQuery) {
                oBinding.filter([]);
                return;
            }

            var oFilter = new Filter({
                and: false,
                filters: [
                    new Filter("poNumber", FilterOperator.Contains, sQuery),
                    new Filter("vendor",   FilterOperator.Contains, sQuery)
                ]
            });

            oBinding.filter(oFilter);
        }
    });
});