document.getElementById('emailtext').innerHTML += 'contact' + '@astanik' + '.dev';

const projectsBox = document.getElementById('projectsbox');

const projects = [
  {
    title: 'Nocte',
    description: 'Game made for OGPC 2024',
    link: 'https://astanik.dev',
    image: 'https://astanik.dev/images/testimagenocte.png'
  },
  {
    title: 'Planck',
    description: 'Messaging app',
    link: 'https://astanik.dev',
    image: 'https://astanik.dev/images/planck.png'
  },
  {
    title: 'Symbiont',
    description: 'Game made for OGPC 2023',
    link: 'https://astanik.dev',
    image: 'https://astanik.dev/images/symbiont.png'
  }
];

const toggleProject = projectElement => () => {
  projectElements.forEach(project => {
    if (project === projectElement) {
      project.classList.toggle('project-expanded');
    } else {
      project.classList.remove('project-expanded');
    }
    if (!project.classList.contains('project-expanded')) {
      const leftOffset = project.childNodes[0].getAttribute('data-left-offset');
      const topOffset = project.childNodes[0].getAttribute('data-top-offset');
      project.childNodes[0].style.left = leftOffset;
      project.childNodes[0].style.top = topOffset;
    } else {
      project.childNodes[0].style.left = '';
      project.childNodes[0].style.top = '';
    }
  });
};

// Populate projects box
const projectElements = projects.map(project => {
  const projectElement = document.createElement('div');
  projectElement.classList.add('project');

  const projectImage = document.createElement('img');
  projectImage.src = project.image;
  projectImage.onclick = toggleProject(projectElement);
  projectImage.ontransitionstart = () => {
    if (projectElement.classList.contains('project-expanded')) {
      projectImage.style.zIndex = 1;
    }
  }
  projectImage.ontransitionend = () => {
    if (!projectElement.classList.contains('project-expanded')) {
      projectImage.style.zIndex = '';
    }
  }
  projectElement.appendChild(projectImage);

  const projectTitle = document.createElement('h3');
  projectTitle.textContent = project.title;
  projectElement.appendChild(projectTitle);

  const projectDescription = document.createElement('p');
  projectDescription.textContent = project.description;
  projectElement.appendChild(projectDescription);

  const projectLink = document.createElement('a');
  projectLink.href = project.link;
  projectLink.textContent = 'View project';
  projectElement.appendChild(projectLink);

  return projectElement;
});

// Sort projects into grid
const grid = [];
let row = [];
let rowWidth = 0;
projectElements.forEach(projectElement => {
  const projectWidth = 1;
  projectElement.childNodes[0].setAttribute('data-left-offset', rowWidth * 17.5 + 'rem');
  projectElement.childNodes[0].setAttribute('data-top-offset', grid.length * 17.5 + 'rem');
  projectElement.childNodes[0].style.left = rowWidth * 17.5 + 'rem';
  projectElement.childNodes[0].style.top = grid.length * 17.5 + 'rem';
  if (rowWidth + projectWidth > 3) {
    grid.push(row);
    row = [];
    rowWidth = 0;
  }
  row.push(projectElement);
  rowWidth += projectWidth;
});

grid.push(row);

grid.forEach(row => {
  const rowElement = document.createElement('div');
  rowElement.classList.add('project-row');
  row.forEach(projectElement => {
    rowElement.appendChild(projectElement);
  });
  projectsBox.appendChild(rowElement);
});
