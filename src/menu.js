import { app, dialog, Menu, MenuItem } from 'electron';
import { fetchTodos, loadTodos, saveTodos, undoTodo, redoTodo } from './App/TodoList/TodoList.actions';

function getDefaultSubmenu(role) {
  return new MenuItem({ role }).submenu.items.map(menuItem => ({ ...menuItem }));
}

export default (win, store) => {
  const template = [];

  if (process.platform === 'darwin') {
    const appMenu = {
      label: app.name,
      submenu: getDefaultSubmenu('appMenu'),
    };
    template.push(appMenu);
  }

  const fileMenu = {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CommandOrControl+N',
        click: () => dialog.showMessageBox(win, {
          type: 'warning',
          buttons: ['OK', 'Cancel'],
          title: 'Create New List',
          message: 'Creating a new list will overwrite any new changes. Do you wish to proceed?',
        }).then(({ response }) => {
          if (response === 0) {
            store.dispatch(loadTodos([]));
          }
        }),
      },
      {
        label: 'Load Last Saved',
        accelerator: 'CommandOrControl+R',
        click: () => dialog.showMessageBox(win, {
          type: 'warning',
          buttons: ['OK', 'Cancel'],
          title: 'Load Last Saved',
          message: 'Loading last saved will overwrite any new changes. Do you wish to proceed?',
        }).then(({ response }) => {
          if (response === 0) {
            store.dispatch(fetchTodos({ isNetwork: true }));
          }
        })
        ,
      },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => store.dispatch(saveTodos()),
      },
      { type: 'separator' },
      ...getDefaultSubmenu('fileMenu'),
    ],
  };
  template.push(fileMenu);

  const [undo, redo, ...rest] = getDefaultSubmenu('editMenu');
  const editMenu = {
    label: 'Edit',
    submenu: [
      {
        ...undo,
        role: 'normal',
        accelerator: 'CommandOrControl+Z',
        click: () => {
          const state = store.getState();
          if (state.todos.past.length > 0) {
            store.dispatch(undoTodo());
          } else {
            win.webContents.undo();
          }
        },
      },
      {
        ...redo,
        role: 'normal',
        accelerator: 'CommandOrControl+Shift+Z',
        click: () => {
          const state = store.getState();
          if (state.todos.future.length > 0) {
            store.dispatch(redoTodo());
          } else {
            win.webContents.redo();
          }
        },
      },
      ...rest,
    ],
  };
  template.push(editMenu);

  const viewMenu = {
    label: 'View',
    submenu: [
      { role: 'togglefullscreen' },
      ...(process.env.NODE_ENV === 'development' ? [
        {
          role: 'reload',
          accelerator: 'CommandOrControl+Shift+R',
        },
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
