//

const defaultOnlyIfURIMatchesRegEx = "^.+$";

var previousOnlyIfURIMatchesRegEx = defaultOnlyIfURIMatchesRegEx;
var previousResultNameSuffix = "-result";

function retrieveOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#onlyIfURIMatchesRegEx").value =
      previousOnlyIfURIMatchesRegEx = result.onlyIfURIMatchesRegEx;
    document.querySelector("#showFileChooserDialog").checked = result.showFileChooserDialog;
    document.querySelector("#resultNameSuffix").value =
      previousResultNameSuffix = result.resultNameSuffix;
    document.querySelector("#ifConflictThenUniquify").checked = result.ifConflictThen === "uniquify";
    document.querySelector("#ifConflictThenOverwrite").checked = result.ifConflictThen === "overwrite";
  }
  function onError(error) {
    console.log(`Error: ${error}`);
  }
  var getting = browser.storage.local.get({
    "onlyIfURIMatchesRegEx":defaultOnlyIfURIMatchesRegEx,
    "showFileChooserDialog":true,
    "resultNameSuffix":"-result",
    "ifConflictThen":"uniquify",
  });
  getting.then(setCurrentChoice, onError);
}
document.addEventListener("DOMContentLoaded", retrieveOptions);

function storeOptions(e) {
  e.preventDefault();
  //
  // sanity checks
  var usePreviousOnlyIfURIMatchesRegEx = false;
  var newOnlyIfURIMatchesRegEx = document.querySelector("#onlyIfURIMatchesRegEx").value;
  if (newOnlyIfURIMatchesRegEx.trim() !== newOnlyIfURIMatchesRegEx) { // leading or trailing space
    usePreviousOnlyIfURIMatchesRegEx = true;
  }
  if (!/^.+$/.test(newOnlyIfURIMatchesRegEx)) { // at least something
    usePreviousOnlyIfURIMatchesRegEx = true;
  }
  try {
    var onlyIfURIMatchesRegExp = new RegExp(newOnlyIfURIMatchesRegEx);
  } catch (e) { // apparently not a valid regular expression
    usePreviousOnlyIfURIMatchesRegEx = true;
  }
  if (usePreviousOnlyIfURIMatchesRegEx) {
    document.querySelector("#onlyIfURIMatchesRegEx").value = previousOnlyIfURIMatchesRegEx;
  } else {
    previousOnlyIfURIMatchesRegEx = newOnlyIfURIMatchesRegEx;
  }
  //
  // sanity checks
  var usePreviousResultNameSuffix = false;
  var newResultNameSuffix = document.querySelector("#resultNameSuffix").value;
  if (!/^[-._~$@a-zA-Z0-9()[\]{} ]*$/.test(newResultNameSuffix)) {
    usePreviousResultNameSuffix = true;
  }
  if (newResultNameSuffix.trimRight() !== newResultNameSuffix) { // trailing space
    usePreviousResultNameSuffix = true;
  }
  if (usePreviousResultNameSuffix) {
    document.querySelector("#resultNameSuffix").value = previousResultNameSuffix;
  } else {
    previousResultNameSuffix = newResultNameSuffix;
  }
  //
  browser.storage.local.set({
    onlyIfURIMatchesRegEx: document.querySelector("#onlyIfURIMatchesRegEx").value,
    showFileChooserDialog: document.querySelector("#showFileChooserDialog").checked,
    resultNameSuffix: document.querySelector("#resultNameSuffix").value,
    ifConflictThen: document.querySelector("#ifConflictThenOverwrite").checked
      ? "overwrite"
      : "uniquify",
  });
}
document.querySelector("form").addEventListener("submit", storeOptions);

function onStorageChange(changes, area) {
  var changedItems = new Set(Object.keys(changes));
  if (changedItems.has("onlyIfURIMatchesRegEx"))
    document.querySelector("#onlyIfURIMatchesRegEx").value = changes.onlyIfURIMatchesRegEx.newValue;
  if (changedItems.has("showFileChooserDialog"))
    document.querySelector("#showFileChooserDialog").checked = changes.showFileChooserDialog.newValue;
  if (changedItems.has("resultNameSuffix"))
    document.querySelector("#resultNameSuffix").value = changes.resultNameSuffix.newValue;
  if (changedItems.has("ifConflictThen")) {
    document.querySelector("#ifConflictThenUniquify").checked = changes.ifConflictThen.newValue === "uniquify";
    document.querySelector("#ifConflictThenOverwrite").checked = changes.ifConflictThen.newValue === "overwrite";
  }
}
browser.storage.onChanged.addListener(onStorageChange);
