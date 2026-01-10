sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("com.ust.po.posample.controller.Detail", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            // "POHeaders(ID=...,IsActiveEntity=true)" from navTo
            var sPathPart = oEvent.getParameter("arguments").path || "";

            // ensure leading "/"
            var sFullPath = sPathPart.charAt(0) === "/" ? sPathPart : "/" + sPathPart;

            // Bind the Detail view to that single POHeader and expand POItems
            this.getView().bindElement({
                path: sFullPath,
                parameters: {
                    expand: "POItems"
                }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("View1", {}, true);
            }
        }
    });
});