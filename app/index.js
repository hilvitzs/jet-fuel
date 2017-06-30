$('.url-submit').on('click', () => {
  selectFolder();
  $('.folder-selection').val('');
  $('.url-input').val('');
});

$('.folder-submit').on('click', () => {
  const userInput = $('.folder-input');
  addFolder(userInput.val());
  getAllFolders();
  userInput.val('');
});

const hashUrl = () => {
  const characters = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];
  let hashed = '';

  for (let i = 0; i < 15; i++) {
    const random = Math.floor(Math.random() * characters.length - 1) + 1;
    hashed += characters[random]
  }
  return hashed;
}

const addFolder = (input) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input })
  });
}

const getAllFolders = () => {
  fetch('/api/v1/folders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(folders => prependFolders(folders));
}

getAllFolders();

const prependFolders = (array) => {
  array.map(folder => {
    return $('.folders').prepend(`
      <div class='folder'>
        ${folder.title}
      </div>`)
  });
}

const selectFolder = () => {
  const folderTitle = $('.folder-selection').val()
  const url = $('.url-input').val()

  fetch('/api/v1/folders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(folders => {
    const foundFolder = folders.find(folder => folder.title === folderTitle);
    return addLink(url, foundFolder);
  });
}

const addLink = (url, folder) => {
  const hashedUrl = hashUrl();

  fetch(`/api/v1/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      long_url: url,
      short_url: hashedUrl,
      visits: 0,
      folder_id: folder.id
    })
  });
}

const getSpecificFolder = (activeFolder) => {
  fetch('/api/v1/folders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(folders => {
    const foundFolder = folders.find(folder => folder.title == activeFolder.innerText);
    return getLinks(foundFolder, activeFolder);
  });
}

const getLinks = (foundFolder, folder) => {
  fetch(`/api/v1/folders/${foundFolder.id}/links`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(links => links.map(link => {
    return $(folder).after(`
    <a class='link' href='${link.long_url}'>${link.short_url}</a>
    <p>${link.visits}</p>`)
  }));
}

$('.folders').on('click', (event) => {
  console.log('worked');
  getSpecificFolder(event.target);
});
