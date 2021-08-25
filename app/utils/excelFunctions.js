import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { importDataFromExcelSQLite, fetchData } from "../sqLite/SQLiteDB";
import { showError, successMessage } from "./helpersFunctions";
import { defaultState } from "../store/state";
import { constants } from "../constants";

const exportData = async (state) => {
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(state.transactions);
    var ws2 = XLSX.utils.json_to_sheet(state.categories);
    var ws3 = XLSX.utils.json_to_sheet(state.wallets);
    var ws4 = XLSX.utils.json_to_sheet(state.customFields);
    var ws5 = XLSX.utils.json_to_sheet(state.customFieldsListValues);
    var ws6 = XLSX.utils.json_to_sheet(state.customFieldsValues);

    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.utils.book_append_sheet(wb, ws2, "Categories");
    XLSX.utils.book_append_sheet(wb, ws3, "Wallets");
    XLSX.utils.book_append_sheet(wb, ws4, "CustomFields");
    XLSX.utils.book_append_sheet(wb, ws5, "CustomFieldsListValues");
    XLSX.utils.book_append_sheet(wb, ws6, "CustomFieldsValues");

    const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
    });

    const uri = FileSystem.cacheDirectory + "FinanceProData.xlsx";

    await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
        mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "MyWater data",
        UTI: "com.microsoft.excel.xlsx",
    });
};

const importData = async (state, setState) => {
    DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
        .then(({ type, uri, name }) => {
            if (type == "success") {
                FileSystem.readAsStringAsync(uri, {
                    encoding: "base64",
                })
                    .then((b64) => XLSX.read(b64, { type: "base64" }))
                    .then(async (wb) => {
                        const transactions = [];
                        const categories = [];
                        const wallets = [];
                        const customFilds = [];
                        const customFieldsListValues = [];
                        const customFieldsValues = [];

                        // Transactions
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws, {
                            header: 1,
                        });

                        var idIndex = data[0].findIndex((item) => item == "id");
                        const amountIndex = data[0].findIndex(
                            (item) => item == "amount"
                        );
                        var typeIndex = data[0].findIndex(
                            (item) => item == "type"
                        );
                        const dateIndex = data[0].findIndex(
                            (item) => item == "date"
                        );
                        const categoryIdIndex = data[0].findIndex(
                            (item) => item == "categoryId"
                        );
                        const noteIndex = data[0].findIndex(
                            (item) => item == "note"
                        );
                        const toAccountIdIndex = data[0].findIndex(
                            (item) => item == "toAccountId"
                        );
                        const fromAccountIdIndex = data[0].findIndex(
                            (item) => item == "fromAccountId"
                        );

                        data.forEach((element, index) => {
                            if (index > 0) {
                                var imported = {
                                    id: element[idIndex],
                                    type: element[typeIndex],
                                    amount: element[amountIndex],
                                    date: new Date(element[dateIndex]),
                                    categoryId: element[categoryIdIndex],
                                    note: element[noteIndex],
                                    toAccountId: element[toAccountIdIndex],
                                    fromAccountId: element[fromAccountIdIndex],
                                };

                                transactions.push(imported);
                            }
                        });

                        // Categoryes
                        const wsname2 = wb.SheetNames[1];
                        const ws2 = wb.Sheets[wsname2];
                        const data2 = XLSX.utils.sheet_to_json(ws2, {
                            header: 1,
                        });

                        var idIndex = data2[0].findIndex(
                            (item) => item == "id"
                        );
                        var nameIndex = data2[0].findIndex(
                            (item) => item == "name"
                        );

                        typeIndex = data2[0].findIndex(
                            (item) => item == "type"
                        );

                        var colorIndex = data2[0].findIndex(
                            (item) => item == "color"
                        );
                        var iconIndex = data2[0].findIndex(
                            (item) => item == "icon"
                        );

                        data2.forEach((element, index) => {
                            if (index > 0) {
                                categories.push({
                                    id: element[idIndex],
                                    name: element[nameIndex],
                                    type: element[typeIndex],
                                    color: element[colorIndex],
                                    icon: element[iconIndex],
                                });
                            }
                        });

                        // Wallets

                        const wsname3 = wb.SheetNames[2];
                        const ws3 = wb.Sheets[wsname3];
                        const data3 = XLSX.utils.sheet_to_json(ws3, {
                            header: 1,
                        });

                        var idIndex = data3[0].findIndex(
                            (item) => item == "id"
                        );
                        var nameIndex = data3[0].findIndex(
                            (item) => item == "name"
                        );

                        ballanceIndex = data3[0].findIndex(
                            (item) => item == "ballance"
                        );

                        var colorIndex = data3[0].findIndex(
                            (item) => item == "color"
                        );

                        data3.forEach((element, index) => {
                            if (index > 0) {
                                wallets.push({
                                    id: element[idIndex],
                                    name: element[nameIndex],
                                    ballance: element[ballanceIndex],
                                    color: element[colorIndex],
                                });
                            }
                        });

                        // Custom Fields

                        const wsname4 = wb.SheetNames[3];
                        const ws4 = wb.Sheets[wsname4];
                        const data4 = XLSX.utils.sheet_to_json(ws4, {
                            header: 1,
                        });

                        var idIndex = data4[0].findIndex(
                            (item) => item == "id"
                        );
                        var nameIndex = data4[0].findIndex(
                            (item) => item == "name"
                        );

                        var categoryIndex = data4[0].findIndex(
                            (item) => item == "category"
                        );

                        var typeIndex = data4[0].findIndex(
                            (item) => item == "type"
                        );

                        data4.forEach((element, index) => {
                            if (index > 0) {
                                customFilds.push({
                                    id: element[idIndex],
                                    name: element[nameIndex],
                                    category: element[categoryIndex],
                                    type: element[typeIndex],
                                });
                            }
                        });

                        // CustomFieldListValues

                        const wsname5 = wb.SheetNames[4];
                        const ws5 = wb.Sheets[wsname5];
                        const data5 = XLSX.utils.sheet_to_json(ws5, {
                            header: 1,
                        });

                        var idIndex = data5[0].findIndex(
                            (item) => item == "id"
                        );
                        var customFieldIdIndex = data5[0].findIndex(
                            (item) => item == "customFieldId"
                        );

                        var valueIndex = data5[0].findIndex(
                            (item) => item == "value"
                        );

                        data5.forEach((element, index) => {
                            if (index > 0) {
                                customFieldsListValues.push({
                                    id: element[idIndex],
                                    customFieldId: element[customFieldIdIndex],
                                    value: element[valueIndex],
                                });
                            }
                        });

                        // CustomFieldsValues

                        const wsname6 = wb.SheetNames[5];
                        const ws6 = wb.Sheets[wsname6];
                        const data6 = XLSX.utils.sheet_to_json(ws6, {
                            header: 1,
                        });

                        var idIndex = data6[0].findIndex(
                            (item) => item == "id"
                        );
                        var customFieldIdIndex = data6[0].findIndex(
                            (item) => item == "customFieldId"
                        );

                        var valueIndex = data6[0].findIndex(
                            (item) => item == "value"
                        );

                        var transactionIdIndex = data6[0].findIndex(
                            (item) => item == "transactionId"
                        );

                        data6.forEach((element, index) => {
                            if (index > 0) {
                                customFieldsValues.push({
                                    id: element[idIndex],
                                    customFieldId: element[customFieldIdIndex],
                                    value: element[valueIndex],
                                    transactionId: element[transactionIdIndex],
                                });
                            }
                        });

                        const dataToImport = {
                            transactions,
                            categories,
                            wallets,
                            customFilds,
                            customFieldsListValues,
                            customFieldsValues,
                        };

                        if (defaultState.user == constants.offline) {
                            importDataFromExcelSQLite(dataToImport);
                        } else {
                            await importDataRest(dataToImport);
                        }

                        defaultState.transactions = transactions;
                        defaultState.categories = categories;
                        defaultState.wallets = wallets;
                        defaultState.customFields = customFilds;
                        defaultState.customFieldsListValues =
                            customFieldsListValues;
                        defaultState.customFieldsValues = customFieldsValues;
                        setState({ ...defaultState });

                        successMessage("Data imported successfuly");
                    });
            }
        })
        .catch((error) => showError(error));
};

export { exportData, importData };
