(() => {
  const STORAGE_KEY = "timos-files-v1";
  const rootId = "root";
  const listElement = document.getElementById("files-list");
  if (!listElement) return;

  const explorerView = document.getElementById("file-explorer-view");
  const editorView = document.getElementById("text-file-editor");
  const breadcrumbs = document.getElementById("files-breadcrumbs");
  const status = document.getElementById("files-status");
  const editorStatus = document.getElementById("text-file-status");
  const editorName = document.getElementById("text-file-name");
  const editor = document.getElementById("text-file-content");
  const deleteButton = document.getElementById("files-delete-btn");
  let currentFolderId = rootId;
  let selectedItemId = null;
  let openFileId = null;
  let items = loadItems();

  function loadItems() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(data)) return [];
      return data.filter(item => item && typeof item.id === "string" &&
        typeof item.name === "string" && (item.type === "folder" || item.type === "text") &&
        (item.parentId === rootId || typeof item.parentId === "string"));
    } catch (error) {
      console.warn("Could not load Files app data.", error);
      return [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (error) {
      console.warn("Could not save Files app data.", error);
      status.textContent = "Storage is unavailable or full. Your latest change may not be saved.";
      return false;
    }
  }

  function createId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function safeName(name, type) {
    let result = name.trim().replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-").replace(/[. ]+$/g, "");
    if (type === "text") result = result.replace(/\.txt$/i, "").trim();
    return result ? (type === "text" ? `${result}.txt` : result) : "";
  }

  function uniqueName(name, parentId) {
    return !items.some(item => item.parentId === parentId && item.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  }

  function getFolderPath(folderId) {
    const path = [];
    let folder = items.find(item => item.id === folderId && item.type === "folder");
    while (folder) {
      path.unshift(folder);
      folder = items.find(item => item.id === folder.parentId && item.type === "folder");
    }
    return path;
  }

  function renderBreadcrumbs() {
    breadcrumbs.replaceChildren();
    const path = [{ id: rootId, name: "Files" }, ...getFolderPath(currentFolderId)];
    path.forEach((folder, index) => {
      if (index) {
        const separator = document.createElement("span");
        separator.textContent = "/";
        separator.setAttribute("aria-hidden", "true");
        breadcrumbs.append(separator);
      }
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = folder.name;
      button.addEventListener("click", () => {
        currentFolderId = folder.id;
        selectedItemId = null;
        render();
      });
      breadcrumbs.append(button);
    });
  }

  function openTextFile(item) {
    openFileId = item.id;
    editorName.textContent = item.name;
    editor.value = item.content || "";
    editorStatus.textContent = "";
    explorerView.hidden = true;
    editorView.hidden = false;
    editor.focus();
  }

  function render() {
    renderBreadcrumbs();
    listElement.replaceChildren();
    deleteButton.disabled = !selectedItemId;
    const visibleItems = items.filter(item => item.parentId === currentFolderId)
      .sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1);

    if (!visibleItems.length) {
      const empty = document.createElement("p");
      empty.className = "files-empty-state";
      empty.textContent = "This folder is empty. Create a folder or text file to get started.";
      listElement.append(empty);
      return;
    }

    visibleItems.forEach(item => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `file-entry${selectedItemId === item.id ? " selected" : ""}`;
      row.setAttribute("role", "listitem");
      row.setAttribute("aria-pressed", selectedItemId === item.id ? "true" : "false");
      const icon = document.createElement("span");
      icon.className = "file-entry-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = item.type === "folder" ? "📁" : "📄";
      const name = document.createElement("span");
      name.className = "file-entry-name";
      name.textContent = item.name;
      const kind = document.createElement("span");
      kind.className = "file-entry-kind";
      kind.textContent = item.type === "folder" ? "Folder" : "Text file";
      row.append(icon, name, kind);
      row.addEventListener("click", () => {
        selectedItemId = item.id;
        status.textContent = "";
        render();
      });
      row.addEventListener("dblclick", () => {
        if (item.type === "folder") {
          currentFolderId = item.id;
          selectedItemId = null;
          render();
        } else {
          openTextFile(item);
        }
      });
      listElement.append(row);
    });
  }

  function addItem(type) {
    const promptText = type === "folder" ? "Folder name:" : "Text file name (without .txt):";
    const input = window.prompt(promptText);
    if (input === null) return;
    const name = safeName(input, type);
    if (!name) {
      status.textContent = "Enter a name that contains at least one valid character.";
      return;
    }
    if (!uniqueName(name, currentFolderId)) {
      status.textContent = "An item with that name already exists in this folder.";
      return;
    }
    const item = { id: createId(), parentId: currentFolderId, name, type, createdAt: new Date().toISOString() };
    if (type === "text") item.content = "";
    items.push(item);
    if (!persist()) items.pop();
    selectedItemId = item.id;
    status.textContent = type === "text" ? "Text file created. Double-click it to edit." : "Folder created.";
    render();
  }

  document.getElementById("files-new-folder-btn").addEventListener("click", () => addItem("folder"));
  document.getElementById("files-new-text-btn").addEventListener("click", () => addItem("text"));
  deleteButton.addEventListener("click", () => {
    const item = items.find(entry => entry.id === selectedItemId);
    if (!item) return;
    const descendants = new Set([item.id]);
    let changed = true;
    while (changed) {
      changed = false;
      items.forEach(entry => {
        if (descendants.has(entry.parentId) && !descendants.has(entry.id)) {
          descendants.add(entry.id);
          changed = true;
        }
      });
    }
    const message = item.type === "folder"
      ? `Delete “${item.name}” and everything inside it?`
      : `Delete “${item.name}”?`;
    if (!window.confirm(message)) return;
    const previousItems = items;
    items = items.filter(entry => !descendants.has(entry.id));
    if (!persist()) items = previousItems;
    selectedItemId = null;
    status.textContent = "";
    render();
  });

  document.getElementById("files-back-btn").addEventListener("click", () => {
    openFileId = null;
    editorView.hidden = true;
    explorerView.hidden = false;
  });
  document.getElementById("files-save-btn").addEventListener("click", () => {
    const item = items.find(entry => entry.id === openFileId && entry.type === "text");
    if (!item) return;
    const previousContent = item.content;
    item.content = editor.value;
    item.updatedAt = new Date().toISOString();
    if (!persist()) item.content = previousContent;
    editorStatus.textContent = item.content === editor.value ? "Saved on this device." : "Could not save. Check available browser storage.";
  });

  render();
})();
