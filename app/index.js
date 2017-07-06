let cached = [];

const hashUrl = () => {
  const characters = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];
  let hashed = '';

  for (let i = 0; i < 10; i++) {
    const random = Math.floor(Math.random() * characters.length - 1) + 1;
    hashed += characters[random]
  }
  return hashed;
}

const prependFolders = (array) => {
  $('.folders').empty();
  array.map(folder => {
    return $('.folders').prepend(`
      <div class='folder' id=${folder.id}>
        <p id=${folder.id}>${folder.title}</p>
      </div>`)
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

const addFolder = (input) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input })
  })
  .then(() => getAllFolders());
}

const addLink = (url, folder) => {
  const hashedUrl = hashUrl();

  fetch('/api/v1/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      long_url: url,
      short_url: hashedUrl,
      folder_id: folder.id
    })
  });
}

const selectFolder = () => {
  const folderTitle = $('.folder-selection').val();
  const url = $('.url-input').val();
  const regex = new RegExp('^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.)');
  const validated = regex.test(url);

  if (validated) {
    fetch('/api/v1/folders', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(folders => {
      const foundFolder = folders.find(folder => folder.title === folderTitle);
      return addLink(url, foundFolder);
    });
  } else {
    alert('Please enter a valid url beginning with http://')
  }
}

const appendLinks = (array, folder) => {
  $('.links').empty();
  array.map(item => {
    const date = item.created_at.split('T')[0];
    $('.links').append(`
      <section class='link'>
        <a href='/${item.short_url}'>${item.short_url}</a>
        <p>Visits: ${item.visits}</p>
        <p>Added: ${date}</p>
      </section>
      `)
    });
    $(folder).append($('.links'));
  }

  const getLinks = (foundFolder, folder) => {
    fetch(`/api/v1/folders/${foundFolder.id}/links`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(links => {
      cached = links
      return appendLinks(links, folder)
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

const sortLinksByVisits = (sortOrder, array) => {
  const folder = $('.active').parent();

  if (sortOrder === 'Sort by visits (low to high)') {
    array.sort((a, b) => {
      return a.visits - b.visits;
    });
  } else {
    array.sort((a, b) => {
      return b.visits - a.visits;
    });
  }

  return appendLinks(array, folder);
}

const sortLinksByDate = (sortOrder, array) => {
  const folder = $('.active').parent();

  if (sortOrder === 'Sort by date (least recent)') {
    array.sort((a, b) => {
      return a.id - b.id;
    });
  } else {
    array.sort((a, b) => {
      return b.id - a.id;
    });
  }

  return appendLinks(array, folder)
}

$('.folder-submit').on('click', () => {
  const userInput = $('.folder-input');
  addFolder(userInput.val());
  userInput.val('');
});

$('.url-submit').on('click', () => {
  selectFolder();
  $('.folder-selection').val('');
  $('.url-input').val('');
});

$('.folders').on('click', (event) => {
  $('.active').removeClass('active');
  $(event.target).addClass('active');
  getSpecificFolder(event.target);
});

$('.sort-by-visits').on('click', () => {
  if ($('.sort-by-visits').html() === 'Sort by visits (low to high)') {
    $('.sort-by-visits').html('Sort by visits (high to low)');
  } else {
    $('.sort-by-visits').html('Sort by visits (low to high)');
  }

  return sortLinksByVisits($('.sort-by-visits').html(), cached);
});

$('.sort-by-added').on('click', () => {
  if ($('.sort-by-added').html() === 'Sort by date (most recent)') {
    $('.sort-by-added').html('Sort by date (least recent)')
  } else {
    $('.sort-by-added').html('Sort by date (most recent)')
  }

  return sortLinksByDate($('.sort-by-added').html(), cached);
})

getAllFolders();
