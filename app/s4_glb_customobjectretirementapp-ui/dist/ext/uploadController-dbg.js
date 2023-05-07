sap.ui.define(
    ["sap/m/MessageBox", "sap/m/MessageToast"],
    function (MessageBox, MessageToast) {
        "use strict";

        function _createUploadController(oExtensionAPI, Entity) {
            var oUploadDialog;

            function setOkButtonEnabled(bOk) {
                oUploadDialog && oUploadDialog.getBeginButton().setEnabled(bOk);
            }

            function setDialogBusy(bBusy) {
                oUploadDialog.setBusy(bBusy)
            }

            function closeDialog() {
                oUploadDialog && oUploadDialog.close()
            }

            function showError(sMessage) {
                MessageBox.error(sMessage || "Upload failed")
            }

            function byId(sId) {
                return sap.ui.core.Fragment.byId("uploadDialog", sId);
            }

            return {
                onBeforeOpen: function (oEvent) {
                    oUploadDialog = oEvent.getSource();
                    oExtensionAPI.addDependent(oUploadDialog);
                },

                onAfterClose: function (oEvent) {
                    oExtensionAPI.removeDependent(oUploadDialog);
                    oUploadDialog.destroy();
                    oUploadDialog = undefined;
                },

                onOk: function (oEvent) {
                    setDialogBusy(true)

                    var oFileUploader = byId("uploader")

                    var headPar = new sap.ui.unified.FileUploaderParameter();
                    // headPar.setName('slug');
                    // headPar.setValue(Entity);
                    // oFileUploader.removeHeaderParameter('slug');
                    // oFileUploader.addHeaderParameter(headPar);
                    var baseURL = oExtensionAPI._controller.extensionAPI._controller._oAppComponent.getManifestObject()._oBaseUri._string;
                    console.log("Base URL:", baseURL)
                    if (!(baseURL.includes("port4004-workspaces-ws"))) {
                        var oriURL = oFileUploader.getUploadUrl();
                        console.log("Original URL:",oriURL)
                        var sUploadUri = oExtensionAPI._controller.extensionAPI._controller._oAppComponent.getManifestObject().resolveUri("./main/excelUpload/excel")
                        oFileUploader.setUploadUrl(sUploadUri);
                        console.log("Upload URL:", sUploadUri)
                    }

                    oFileUploader
                        .checkFileReadable()
                        .then(function () {
                            oFileUploader.upload();
                        })
                        .catch(function (error) {
                            showError("The file cannot be read.");
                            setDialogBusy(false)
                        })
                },

                onCancel: function (oEvent) {
                    closeDialog();
                },

                onTypeMismatch: function (oEvent) {
                    var sSupportedFileTypes = oEvent
                        .getSource()
                        .getFileType()
                        .map(function (sFileType) {
                            return "*." + sFileType;
                        })
                        .join(", ");

                    showError(
                        "The file type *." +
                        oEvent.getParameter("fileType") +
                        " is not supported. Choose one of the following types: " +
                        sSupportedFileTypes
                    );
                },

                onFileAllowed: function (oEvent) {
                    setOkButtonEnabled(true)
                },

                onFileEmpty: function (oEvent) {
                    setOkButtonEnabled(false)
                },

                onUploadComplete: function (oEvent) {
                    var iStatus = oEvent.getParameter("status");
                    var oFileUploader = oEvent.getSource()

                    oFileUploader.clear();
                    setOkButtonEnabled(false)
                    setDialogBusy(false)

                    if (iStatus >= 400) {
                        console.log("ERROR");
                        if (typeof oEvent.getParameter("responseRaw") === 'string') {
                            showError(oEvent.getParameter("responseRaw"))
                        } else {
                            var oRawResponse = JSON.parse(oEvent.getParameter("responseRaw"));
                            showError(oRawResponse && oRawResponse.error && oRawResponse.error.message);
                        }
                    } else {
                        MessageToast.show("Uploaded successfully");
                        oExtensionAPI.refresh()
                        closeDialog();
                    }
                }
            };
        }

        return {
            showUploadDialog: function (oBindingContext, aSelectedContexts) {
                this.loadFragment({
                    id: "uploadDialog",
                    name: "objectRetirementApp.s4glbcustomobjectretirementappui.ext.uploadDialog",
                    controller: _createUploadController(this)
                }).then(function (oDialog) {
                    oDialog.open();
                });
            }
        };
    }
);