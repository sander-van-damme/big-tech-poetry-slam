let companiesHostnames = fetch(chrome.runtime.getURL('companies-hostnames.json')).then(res => res.json());

async function handleRequest(requestDetails) {
  const requestHostname = new URL(requestDetails.url).hostname;
  companiesHostnames = await companiesHostnames;
  chrome.tts.isSpeaking(isSpeaking => {
    if (!isSpeaking) {
      for (const [companyName, companyHostnames] of Object.entries(companiesHostnames)) {
        companyHostnames.forEach(companyHostname => {
          if (requestHostname.endsWith(companyHostname)) {
            chrome.tts.speak(companyName, { 'rate': 1 + Math.random() / 5, 'pitch': Math.random() * 2, 'volume': 1 - Math.random() / 10 });
            return true;
          }
        });
      }
    }
  });
  return false;
}

chrome.webRequest.onCompleted.addListener(handleRequest, { urls: ["<all_urls>"] });
