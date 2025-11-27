const USER_DATA = [
  { id: 1, code: '0001', name: 'Sabrina Hoover', color: 'red' },
  { id: 2, code: '0002', name: 'Marco Rossi', color: 'blue' },
  { id: 3, code: '0003', name: 'Laura Bianchi', color: 'green' },
  { id: 4, code: '0004', name: 'Giuseppe Verdi', color: 'yellow' },
  { id: 5, code: '0005', name: 'Greta Verdi', color: 'verdi' },
];

const TABLE_CONFIG = {
  caption: {
    className: 'visually-hidden',
    textContent: ' Elenco utenti ',
  },
  columns: [
    {
      columnId: 1,
      columnType: 'checkbox',
      ariaLabel: 'Seleziona la riga',
    },
    {
      columnId: 2,
      columnType: 'data',
      propertyName: 'code',
      label: 'Code',
    },
    {
      columnId: 3,
      columnType: 'data',
      propertyName: 'name',
      label: 'Name',
    },
    {
      columnId: 4,
      columnType: 'data',
      propertyName: 'color',
      label: 'Color',
    },
    {
      columnId: 5,
      columnType: 'actions',
      label: 'Actions',
      actions: [
        {
          actionType: 'edit',
          button: {
            className: 'icon-button',
            title: 'Modifica',
            ariaLabel: 'Modifica la riga',
            iconClass: 'fa-edit',
          },
        },
        {
          actionType: 'delete',
          button: {
            className: 'icon-button1',
            title: 'Elimina',
            ariaLabel: 'Elimina la riga',
            iconClass: 'fa-trash',
          },
        },
        {
          actionType: 'options',
          button: {
            className: 'icon-button',
            title: 'Azioni',
            ariaLabel: 'Altre azioni sulla riga',
            iconClass: 'fa-ellipsis-h',
          },
          dialogConfig: {
            actions: [
              {
                actionType: 'preview',
                button: {
                  className: 'icon-button',
                  title: 'Visualizza anteprima',
                  ariaLabel: 'Visualizza anteprima',
                  iconClass: 'fa-eye',
                },
              },
              {
                actionType: 'details',
                button: {
                  className: 'icon-button',
                  title: 'Visualizza dettagli',
                  ariaLabel: 'Visualizza dettagli',
                  iconClass: 'fa-info',
                },
              },
              {
                actionType: 'close',
                button: {
                  className: 'icon-button',
                  title: 'Chiudi',
                  ariaLabel: 'Chiudi il dialog',
                  iconClass: 'fa-xmark',
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

const MOBILE_BREAKPOINT = 768;
let isShowingMobile = false;

const openDialog = (id) => {
  document.getElementById(id).show();
};

const closeDialog = (id) => {
  document.getElementById(id).close();
};

function createCaption({ className, textContent }) {
  const caption = document.createElement('caption');
  caption.className = className;
  caption.textContent = textContent;
  return caption;
}

function createCheckbox(ariaLabel = null) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (ariaLabel) {
    checkbox.setAttribute('aria-label', ariaLabel);
  }
  return checkbox;
}

function createIcon(iconClass) {
  const icon = document.createElement('i');
  icon.className = `fa ${iconClass}`;
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function createButton({ className, title, ariaLabel, iconClass }, onclick = null) {
  const button = document.createElement('button');
  button.className = className;
  button.title = title;
  button.setAttribute('aria-label', ariaLabel);
  if (onclick) {
    button.onclick = onclick;
  }
  button.appendChild(createIcon(iconClass));
  return button;
}

function createDialog({ actions }, rowId) {
  const dialog = document.createElement('dialog');
  dialog.id = `dialog${rowId}`;
  actions.forEach(({ actionType, button }) => {
    const buttonElement =
      actionType === 'close'
        ? createButton(button, () => closeDialog(`dialog${rowId}`))
        : createButton(button);
    dialog.appendChild(buttonElement);
  });
  return dialog;
}

function createCell(content, className = null) {
  const td = document.createElement('td');
  if (typeof content === 'string') {
    td.textContent = content;
  } else {
    td.appendChild(content);
  }
  if (className) {
    td.className = className;
  }
  return td;
}

function createHeaderCell(content, scope = 'col') {
  const th = document.createElement('th');
  th.scope = scope;
  if (typeof content === 'string') {
    th.textContent = content;
  } else {
    th.appendChild(content);
  }
  return th;
}

function createActionsCell(actions, rowId) {
  const actionsContainer = document.createElement('div');
  actions.forEach(({ actionType, button, dialogConfig }) => {
    if (actionType === 'options') {
      const buttonElement = createButton(button, () => openDialog(`dialog${rowId}`));
      const dialog = createDialog(dialogConfig, rowId);
      actionsContainer.appendChild(buttonElement);
      actionsContainer.appendChild(dialog);
      return;
    }
    const buttonElement = createButton(button);
    actionsContainer.appendChild(buttonElement);
  });
  return actionsContainer;
}

function createDataRow(rowData, columns) {
  const tr = document.createElement('tr');
  columns.forEach(({ columnType, ariaLabel, propertyName, actions }) => {
    let cell;
    if (columnType === 'checkbox') {
      cell = createCell(createCheckbox(ariaLabel));
    } else if (columnType === 'actions') {
      cell = createCell(createActionsCell(actions, rowData.id));
    } else {
      cell = createCell(rowData[propertyName]);
    }
    tr.appendChild(cell);
  });
  return tr;
}

function createHeaderRow(columns) {
  const tr = document.createElement('tr');
  columns.forEach(({ columnType, label }) => {
    if (columnType === 'checkbox') {
      tr.appendChild(createHeaderCell(createCheckbox()));
    } else {
      tr.appendChild(createHeaderCell(label));
    }
  });
  return tr;
}

function createTableHead(columns) {
  const thead = document.createElement('thead');
  thead.appendChild(createHeaderRow(columns));
  return thead;
}

function createMobileRow(label, value, isEven = false) {
  const tr = document.createElement('tr');
  tr.className = isEven ? 'mobile-row-even' : 'mobile-row-odd';
  tr.appendChild(createHeaderCell(label, 'row'));
  tr.appendChild(createCell(value, 'mobile-data'));
  return tr;
}

function createMobileUserGroup(rowData, columns, dataIndex) {
  const fragment = document.createDocumentFragment();
  const isEven = dataIndex % 2 === 0;
  columns.forEach(({ columnType, propertyName, actions, label }) => {
    if (columnType === 'checkbox') {
      return;
    }
    const content =
      columnType === 'actions' ? createActionsCell(actions, rowData.id) : rowData[propertyName];
    fragment.appendChild(createMobileRow(label, content, isEven));
  });
  return fragment;
}

function createTableBody(columns, data, mobile = false) {
  const tbody = document.createElement('tbody');
  data.forEach((rowData, index) => {
    if (mobile) {
      tbody.appendChild(createMobileUserGroup(rowData, columns, index));
    } else {
      tbody.appendChild(createDataRow(rowData, columns));
    }
  });
  return tbody;
}

function generateTable({ caption, columns }, data, tableContainerId, mobile = false) {
  const table = document.getElementById(tableContainerId);
  table.innerHTML = '';
  if (caption) {
    table.appendChild(createCaption(caption));
  }
  if (!mobile) {
    table.appendChild(createTableHead(columns));
  }
  table.appendChild(createTableBody(columns, data, mobile));
}

function drawTable() {
  isShowingMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  generateTable(TABLE_CONFIG, USER_DATA, 'mainTable', isShowingMobile);
}

document.addEventListener('DOMContentLoaded', () => {
  drawTable();
  window.addEventListener('resize', () => {
    const isShowingMobileAfterResize = window.innerWidth <= MOBILE_BREAKPOINT;
    if (isShowingMobileAfterResize !== isShowingMobile) {
      drawTable();
    }
  });
});
