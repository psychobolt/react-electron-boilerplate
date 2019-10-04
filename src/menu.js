import { app, Menu, MenuItem } from 'electron';
import { undoTodo, redoTodo } from './App/TodoList/TodoList.actions';

function getDefaultSubmenu(role) {
  return new MenuItem({ role }).submenu.items.map(menuItem => ({ ...menuItem }));
}

export default (win, store) => {
  const { todos } = store.getState();
  const template = [];

  if (process.platform === 'darwin') {
    const appMenu = {
      label: app.getName(),
      submenu: getDefaultSubmenu('appMenu'),
    };
    template.push(appMenu);
  }

  const [undo, redo, ...rest] = getDefaultSubmenu('editMenu');
  const editMenu = {
    label: 'Edit',
    submenu: [
      undo,
      redo,
      {
        label: 'Undo Todo',
        accelerator: `CommandOrControl+Shift+${process.platform === 'darwin' ? 'U' : 'Z'}`,
        click: () => store.dispatch(undoTodo()),
        enabled: todos.past.length > 0,
      },
      {
        label: 'Redo Todo',
        accelerator: 'CommandOrControl+Shift+Y',
        click: () => store.dispatch(redoTodo()),
        enabled: todos.future.length > 0,
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

  const undoTodoItem = menu.items[process.platform === 'darwin' ? 1 : 0].submenu.items[2];
  const redoTodoItem = menu.items[process.platform === 'darwin' ? 1 : 0].submenu.items[3];
  store.subscribe(() => {
    const state = store.getState();
    undoTodoItem.enabled = state.todos.past.length > 0;
    redoTodoItem.enabled = state.todos.future.length > 0;
  });

  return menu;
};
