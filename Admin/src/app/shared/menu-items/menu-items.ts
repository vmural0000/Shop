import {Injectable} from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'HOME',
    type: 'link',
    icon: 'tachometer'
  },
  {
    state: 'products',
    name: 'MANAGEPRODUCTS',
    type: 'sub',
    icon: 'list-alt',
    children: [
      {
        state: 'list',
        name: 'PRODUCTS'
      },
      {
        state: 'categories',
        name: 'PRODUCTSCATEGORIES'
      }
    ]
  },
  {
    state: 'orders',
    name: 'ORDERS',
    type: 'link',
    icon: 'money'
  }
];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  add(menu: Menu) {
    MENUITEMS.push(menu);
  }
}
