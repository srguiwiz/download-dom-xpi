//

"use strict";

// tried const instead of var but Firefox 58.0.2 on second invocation gave
// Error: redeclaration of const lineBreakRegExp
var lineBreakRegExp = /(\r\n|\r|\n)/

browser.runtime.onMessage.addListener(function (message) {
  if (message.please === "nrvrDomSerialize") {
    var documentAsString = null; // default
    try {
      var documentToSerialize = window.top.document;
      var documentElement = documentToSerialize.documentElement;
      var mode = "XMLSerializer"; // default
      if ( message.respectHTMLIsNotXML // an option
        && documentElement.tagName === "HTML"
        && !documentElement.getAttribute("xmlns")
        && documentToSerialize.doctype.name === "html") {
        mode = "outerHTML";
      }
      //
      switch (mode) {
        case "XMLSerializer": // original case
          var serializer = new XMLSerializer();
          documentAsString = serializer.serializeToString(documentToSerialize);
          break;
        case "outerHTML":
          documentAsString = documentElement.outerHTML;
          var lineBreakRegExpMatch = lineBreakRegExp.exec(documentAsString);
          var lineBreak = lineBreakRegExpMatch ? lineBreakRegExpMatch[1] : "/n";
          documentAsString = "<!DOCTYPE html>" + lineBreak + documentAsString;
          break;
      }
    } catch (e) {
      console.error(e);
    } finally {
      return Promise.resolve({ documentAsString:documentAsString });
    }
  } else {
    return Promise.resolve(Object.assign(message, { problem:"not understood" }));
  }
});
