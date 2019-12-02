import { app, Menu, MenuItem } from 'electron';

function getDefaultSubmenu(role) {
  return new MenuItem({ role }).submenu.items.map(menuItem => ({ ...menuItem }));
}

export default win => {
  const template = [];

  if (process.platform === 'darwin') {
    const appMenu = {
      label: app.name,
      submenu: getDefaultSubmenu('appMenu'),
    };
    template.push(appMenu);
  }

  const editMenu = { role: 'editMenu' };
  template.push(editMenu);

  const viewMenu = {
    label: 'View',
    submenu: [
      { role: 'togglefullscreen' },
      ...(process.env.NODE_ENV === 'development' ? [
        { role: 'reload' },
        { role: 'toggledevtools' },
      ] : []),
    ],
  };
  template.push(viewMenu);

  if (process.env.NODE_ENV === 'development') {
    const goMenu = {
      label: 'Go',
      submenu: [
        {
          label: 'Back',
          accelerator: 'Alt+Left',
          click: () => win.webContents.goBack(),
        },
        {
          label: 'Forward',
          accelerator: 'Alt+Right',
          click: () => win.webContents.goForward(),
        },
      ],
    };
    template.push(goMenu);
  }

  const windowMenu = { role: 'windowMenu' };
  template.push(windowMenu);

  const menu = Menu.buildFromTemplate(template);

  return menu;
};
