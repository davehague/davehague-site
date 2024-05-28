const dbName = "githubCommitData";
const storeName = "commits";

interface CommitEntry {
  authorName: string;
  authorEmail: string;
  authorDate: string;
  message: string;
  htmlUrl: string;
  timestamp: number;
}

export const getCachedCommits = async (
  repo: string,
  since: Date
): Promise<CommitEntry[] | null> => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  const cursorRequest = store.openCursor();

  const commits: CommitEntry[] = [];
  const sinceTime = since.getTime();

  cursorRequest.onsuccess = (event: Event) => {
    const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
    if (cursor) {
      const commit: CommitEntry = cursor.value;
      if (
        commit.htmlUrl.includes(repo) &&
        new Date(commit.authorDate).getTime() > sinceTime
      ) {
        commits.push(commit);
      }
      cursor.continue();
    }
  };

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      db.close();
      resolve(commits);
    };
    transaction.onerror = (event) =>
      reject("Failed to fetch commits from IndexedDB");
  });
};

const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      console.error("IndexedDB could not be opened");
      reject("IndexedDB could not be opened");
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const transaction = request.transaction!;
      let store;

      if (!db.objectStoreNames.contains(storeName)) {
        store = db.createObjectStore(storeName, { keyPath: "htmlUrl" });
      } else {
        store = transaction.objectStore(storeName);
      }

      if (!store.indexNames.contains("authorDate")) {
        store.createIndex("authorDate", "authorDate", { unique: false });
      }
    };
  });
};

export const saveCommitsToIndexedDB = async (data: any[]): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  data.forEach((commitObj) => {
    if (commitObj.html_url) {
      const entry: CommitEntry = {
        authorName: commitObj.commit.author.name,
        authorEmail: commitObj.commit.author.email,
        authorDate: commitObj.commit.author.date,
        message: commitObj.commit.message,
        htmlUrl: commitObj.html_url,
        timestamp: Date.now(),
      };
      store.put(entry);
    } else {
      console.error("Invalid commit entry, missing html_url:", commitObj);
    }
  });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = (event) => reject("Transaction not completed");
  });
};
