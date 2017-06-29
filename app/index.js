$('.url-submit').on('click', () => {
  addLink()
})

 $('.folder-submit').on('click', () => {
  const userInput = $('.folder-input');
  addFolder(userInput.val());
  getFolders();
  userInput.val('');
})


const addFolder = (input) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input })
  });
}

const getFolders = () => {
  fetch('/api/v1/folders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(folders => prependFolders(folders));
}

const prependFolders = (array) => {
  array.map(folder => {
    return $('.folders').prepend(`
      <div class='folder'>
        <p>${folder.title}</p>
      </div>`)
  });
}

const addLink = () => {
  const folderTitle = $('.folder-selection').val()
  const url = $('.url-input').val()

  fetch('/api/v1/folders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(folders => {
    const foundFolder = folders.find(folder => folder.title === folderTitle);
    return postLink(url, foundFolder);
  });
}

const postLink = (url, folder) => {
  fetch(`/api/v1/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      visits: 0,
      folder_id: folder.id
    });
  });
}

const getFolder = (activeFolder) => {
  fetch('/api/v1/folders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(folders => {
    const foundFolder = folders.find(folder => folder.title === activeFolder.textContent);
    return getLinks(foundFolder, activeFolder);
  });
}

const getLinks = (foundFolder, folder) => {
  fetch(`/api/v1/folders/${foundFolder.id}/links`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(links => links.map(link => folder.append(`${link.url}`)));
}

$('.folders').on('click', (event) => {
  getFolder(event.target);
});
