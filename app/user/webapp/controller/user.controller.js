sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    return Controller.extend("user.controller.user", {
        onInit() {
            this.getView().setModel(new JSONModel({
                key: generateUUID(),
                name: "",
                age: "",
                email: "",
                busy: false
            }), "userModel");
        },

        onSubmit() {
            const oFormModel = this.getView().getModel("userModel");
            const oData = oFormModel.getData();

            if (!oData.name || !oData.age || !oData.email) {
                MessageBox.warning("Please fill in all required fields.");
                return;
            }

            oFormModel.setProperty("/busy", true);

            fetch("/service/PostgreSQLTrainingService/User", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    ID: oData.key,
                    Name: oData.name,
                    Age: oData.age,
                    Email: oData.email
                })
            })
            .then((oResponse) => {
                if (!oResponse.ok) {
                    return oResponse.json().then((err) => {
                        throw new Error(err.error?.message || "Server error " + oResponse.status);
                    });
                }
                return oResponse.json();
            })
            .then(() => {
                MessageToast.show("User saved to database successfully!");
                this._resetForm();
            })
            .catch((oError) => {
                MessageBox.error("Failed to save user: " + oError.message);
            })
            .finally(() => {
                oFormModel.setProperty("/busy", false);
            });
        },

        onReset() {
            this._resetForm();
        },

        _resetForm() {
            this.getView().getModel("userModel").setData({
                key: generateUUID(),
                name: "",
                age: "",
                email: "",
                busy: false
            });
        }
    });
});