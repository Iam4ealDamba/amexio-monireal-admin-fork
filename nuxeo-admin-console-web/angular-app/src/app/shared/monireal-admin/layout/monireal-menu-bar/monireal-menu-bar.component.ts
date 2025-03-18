import {Component, OnInit} from "@angular/core";
import {MONI_ADMIN_MENU, MoniMenu} from "./monireal-menu-bar.constants";
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {ADMIN_MENU, Menu} from "src/app/layouts/menu-bar/menu-bar.constants";

/**
 * Represent the aside bar menu for navigation including AmeXio Monireal Admin links
 */
@Component({
  selector: "app-monireal-menu-bar",
  templateUrl: "./monireal-menu-bar.component.html",
  styleUrls: ["./monireal-menu-bar.component.scss"],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatListModule,
  ],
  standalone: true,
})
export class MonirealMenuBarComponent implements OnInit {
  // -----------------------
  // Variables
  // -----------------------
  is_dropdown = false;
  adminConsoleMenu: Menu[] = ADMIN_MENU;
  monirealMenu: MoniMenu[] = MONI_ADMIN_MENU;
  topmenuList: {
    id: number;
    name: string;
    path: string | null;
    isSelected: boolean;
  }[] = [];
  bottomMenuList: {
    id: number;
    name: string;
    path: string | null;
    isSelected: boolean;
  }[] = [];
  
  ngOnInit(): void {
    this.topmenuList = this.getAllTopItemMenu();
    this.bottomMenuList = this.getAllBottomItemMenu();
  }
  
  // -----------------------
  // Functions
  // -----------------------
  
  /**
   *  Select a item in the menu
   * @param id
   */
  menuItemSelected(id: number): void {
    this.monirealMenu = this.monirealMenu.map((item) => ({
      ...item,
      isSelected: item.id === id,
    }));
  }
  
  /**
   * Toggles the dropdown menu when the top menu bar is clicked.
   * It shows or hides the bottom menu depending on the state of the dropdown menu.
   */
  toggleDropdownMenu() {
    this.is_dropdown = !this.is_dropdown;
  }
  
  /**
   *  Returns all the items in the top menu bar of the aside bar component.
   *  The top menu bar is the menu that is always visible and is part of the original Nuxeo Admin Console.
   *  The function returns the list.
   */
  getAllTopItemMenu() {
    const list = [];
    
    for (let i = 0; i < this.adminConsoleMenu.length; i++) {
      list.push({
        id: this.adminConsoleMenu[i].id,
        name: this.adminConsoleMenu[i].name,
        path: this.adminConsoleMenu[i].path,
        isSelected: this.adminConsoleMenu[i].isSelected,
      });
    }
    
    return list;
  }
  
  /**
   * Retrieves all the items in the bottom menu bar of the aside bar component.
   * The bottom menu bar is part of the dropdown menu, which can be toggled.
   * This function iterates over the Monireal Admin menu array and constructs a list of menu items.
   *
   * @returns An array of objects representing the items in the bottom menu bar.
   */
  getAllBottomItemMenu() {
    const list = [];
    
    for (let i = 0; i < this.monirealMenu.length; i++) {
      list.push({
        id: this.monirealMenu[i].id,
        name: this.monirealMenu[i].name,
        path: this.monirealMenu[i].path,
        isSelected: this.monirealMenu[i].isSelected,
      });
    }
    
    return list;
  }
}
