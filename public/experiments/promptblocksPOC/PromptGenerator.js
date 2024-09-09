let db;
const dbName = "promptGenerator";
const storeName = "promptFragments";

function openDb() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open(dbName, 2); // Increment version number

    request.onerror = function (event) {
      console.log("error opening database " + event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = function (event) {
      db = event.target.result;
      console.log("success opening database");
      resolve(db);
    };

    request.onupgradeneeded = function (event) {
      db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
        console.log("objectStore created");
      } else {
        console.log("objectStore already exists");
      }
    };
  });
}

window.onload = function () {
  console.log("Window load event fired");

  openDb()
    .then(() => {
      console.log("Database opened successfully");
      return readFromDb();
    })
    .then((data) => {
      console.log("Read from database complete", data);
      if (data) {
        displayData(data);
        console.log("Data displayed successfully");
      } else {
        console.log("No data in database, waiting for file upload");
      }
    })
    .catch((error) => {
      console.error("Error during initialization:", error);
    });

  console.log("Setting up event listeners");

  // File input change event
  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileSelect);

  // Copy prompt button click event
  document.querySelector("button").addEventListener("click", copyPrompt);

  // Upload button click event
  document
    .getElementById("uploadButton")
    .addEventListener("click", function () {
      console.log("Upload button clicked");
      document.getElementById("fileInput").click();
    });

  console.log("Event listeners set up complete");
};

function writeToDb(data) {
  return new Promise((resolve, reject) => {
    let objectStore = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName);
    objectStore.clear().onsuccess = function (event) {
      console.log("store cleared");
      let addRequest = objectStore.add({ id: "1", data: data });
      addRequest.onerror = function (event) {
        console.log("error writing data " + event.target.errorCode);
        reject(event.target.errorCode);
      };
      addRequest.onsuccess = function (event) {
        console.log("success writing data");
        resolve(data);
      };
    };
  });
}

function readFromDb() {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(storeName)) {
      console.log("Object store does not exist");
      resolve(null);
      return;
    }

    let transaction = db.transaction([storeName], "readonly");
    let objectStore = transaction.objectStore(storeName);
    let request = objectStore.get("1");

    request.onerror = function (event) {
      console.log("error reading data " + event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = function (event) {
      if (request.result) {
        console.log("success reading data");
        resolve(request.result.data);
      } else {
        console.log("no data record");
        resolve(null);
      }
    };
  });
}

function handleFileSelect(event) {
  let file = event.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      try {
        let data = JSON.parse(e.target.result);
        writeToDb(data)
          .then(() => {
            displayData(data);
            console.log("Data uploaded and displayed successfully");
          })
          .catch((error) => {
            console.error("Error writing to database:", error);
          });
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.onerror = function (e) {
      console.error("Error reading file:", e);
    };
    reader.readAsText(file);
  }
}

function updatePrompt() {
  let checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:not([id^="checkboxAll"])'
  );
  let radioButtons = document.querySelectorAll('input[type="radio"]:checked');
  let promptText = "";

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) promptText += checkbox.value + "\n\n";
  });

  radioButtons.forEach((radio) => {
    promptText += radio.value + "\n\n";
  });

  document.getElementById("prompt").value = promptText.trim();
}

function copyPrompt() {
  let copyText = document.getElementById("prompt").value;

  navigator.clipboard.writeText(copyText).then(
    function () {
      // Display "Copied!" message
      let copyMessage = document.getElementById("copyMessage");
      copyMessage.textContent = "Copied to clipboard!";

      // After 2 seconds, clear the message
      setTimeout(() => (copyMessage.textContent = ""), 1000);
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function displayData(data) {
  let promptFragments = data.promptFragments;
  let categories = {};
  let radioIndex = 0; // initialize radio button index

  promptFragments.forEach((fragment) => {
    if (!categories[fragment.category]) categories[fragment.category] = [];
    categories[fragment.category].push(fragment);
  });

  // Clear any existing checkboxes before displaying new ones
  let checkboxesArea = document.getElementById("checkboxesArea");
  while (checkboxesArea.firstChild) {
    checkboxesArea.removeChild(checkboxesArea.firstChild);
  }

  let checkboxIndex = 0; // initialize checkbox index
  for (const category in categories) {
    let categoryDiv = document.createElement("div");
    categoryDiv.className = "category";

    let categoryTitle = document.createElement("h2");
    categoryTitle.textContent = category;
    categoryDiv.appendChild(categoryTitle);

    // If category type is 'multi', add an 'All' checkbox
    if (
      data.categories.find(
        (cat) => cat.name === category && cat.type === "multi"
      )
    ) {
      let checkboxAll = document.createElement("input");
      checkboxAll.type = "checkbox";
      checkboxAll.id = "checkboxAll" + checkboxIndex++; // unique id for each checkbox
      checkboxAll.addEventListener("change", function () {
        // Check/uncheck all checkboxes in this category
        Array.from(
          categoryDiv.querySelectorAll(
            'input[type="checkbox"]:not(#' + checkboxAll.id + ")"
          )
        ).forEach((checkbox) => {
          checkbox.checked = checkboxAll.checked;
        });
        updatePrompt();
      });

      let labelAll = document.createElement("label");
      labelAll.textContent = "All";
      labelAll.htmlFor = checkboxAll.id; // associate label with checkbox

      categoryDiv.appendChild(checkboxAll);
      categoryDiv.appendChild(labelAll);
      categoryDiv.appendChild(document.createElement("br"));
      categoryDiv.appendChild(document.createElement("br"));
    }

    // If category type is 'single', add a 'None' option
    if (
      data.categories.find(
        (cat) => cat.name === category && cat.type === "single"
      )
    ) {
      let radioNone = document.createElement("input");
      radioNone.type = "radio";
      radioNone.id = "radioNone" + radioIndex; // unique id for each radio button
      radioNone.value = "";
      radioNone.name = "radio" + category; // same name for each radio button in a category
      radioNone.checked = true; // 'None' option is selected by default
      radioNone.addEventListener("change", updatePrompt);

      let labelNone = document.createElement("label");
      labelNone.textContent = "None";
      labelNone.htmlFor = radioNone.id; // associate label with radio button

      categoryDiv.appendChild(radioNone);
      categoryDiv.appendChild(labelNone);
      categoryDiv.appendChild(document.createElement("br"));
      categoryDiv.appendChild(document.createElement("br"));
    }

    categories[category].forEach((fragment) => {
      if (
        data.categories.find(
          (cat) => cat.name === category && cat.type === "single"
        )
      ) {
        // Create radio button for single-select categories
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.id = "radio" + radioIndex++; // unique id for each radio button
        radio.value = fragment.promptText;
        radio.name = "radio" + category; // same name for each radio button in a category
        radio.addEventListener("change", updatePrompt);

        let label = document.createElement("label");
        label.textContent = fragment.name;
        label.htmlFor = radio.id; // associate label with radio button

        categoryDiv.appendChild(radio);
        categoryDiv.appendChild(label);
        categoryDiv.appendChild(document.createElement("br"));
        categoryDiv.appendChild(document.createElement("br"));
      } else {
        // Create checkbox for multi-select categories
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox" + checkboxIndex++; // unique id for each checkbox
        checkbox.value = fragment.promptText;
        checkbox.addEventListener("change", updatePrompt);

        let label = document.createElement("label");
        label.textContent = fragment.name;
        label.htmlFor = checkbox.id; // associate label with checkbox

        categoryDiv.appendChild(checkbox);
        categoryDiv.appendChild(label);
        categoryDiv.appendChild(document.createElement("br"));
        categoryDiv.appendChild(document.createElement("br"));
      }
    });

    checkboxesArea.appendChild(categoryDiv);
  }

  let scenarioSelect = document.getElementById("scenarioSelect");
  data.scenarios.forEach((scenario) => {
    let option = document.createElement("option");
    option.textContent = scenario.name;
    option.value = JSON.stringify(scenario.categories);
    scenarioSelect.appendChild(option);
  });
}

function updateScenario(evt) {
  if (evt.target.value === "default") {
    document.querySelectorAll(".category").forEach((div) => {
      div.style.display = "block";
    });
  } else {
    let selectedCategories = JSON.parse(evt.target.value).map((cat) =>
      cat.toLowerCase().trim()
    );

    document.querySelectorAll(".category").forEach((div) => {
      let categoryTitle = div.firstChild.textContent.toLowerCase().trim();

      if (selectedCategories.includes(categoryTitle)) {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
    });
  }

  // Clear everything
  document.querySelectorAll(".category").forEach((div) => {
    div
      .querySelectorAll('input[type="radio"], input[type="checkbox"]')
      .forEach((radio) => {
        radio.checked = false;
      });
  });

  document.getElementById("prompt").value = "";
}

function createCheckbox(fragment, index) {
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "checkbox" + index;
  checkbox.value = fragment.promptText;
  checkbox.addEventListener("change", updatePrompt);

  let label = document.createElement("label");
  label.textContent = fragment.name;
  label.htmlFor = checkbox.id;

  let div = document.createElement("div");
  div.appendChild(checkbox);
  div.appendChild(label);

  return div;
}

function createRadioButton(category, fragment, index, isNoneOption = false) {
  let radioButton = document.createElement("input");
  radioButton.type = "radio";
  radioButton.name = category; // All radio buttons in a category share the same 'name' attribute
  radioButton.id = "radio" + index;
  radioButton.value = isNoneOption ? "" : fragment.promptText;
  radioButton.checked = isNoneOption; // "None" option is checked by default
  radioButton.addEventListener("change", updatePrompt);

  let label = document.createElement("label");
  label.textContent = isNoneOption ? "None" : fragment.name;
  label.htmlFor = radioButton.id;

  let div = document.createElement("div");
  div.appendChild(radioButton);
  div.appendChild(label);

  return div;
}
