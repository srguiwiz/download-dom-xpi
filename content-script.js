//

"use strict";

browser.runtime.onMessage.addListener(function (request) {
  if (request.please === "nrvrDomSerialize") {
    var documentAsString = null; // default
    try {
      var serializer = new XMLSerializer();
      documentAsString = serializer.serializeToString(window.top.document);
    } catch (e) {
      console.error(e);
    } finally {
      return Promise.resolve({ documentAsString:documentAsString });
    }
  } else {
    return Promise.resolve(Object.assign(request, { problem:"not understood" }));
  }
});
