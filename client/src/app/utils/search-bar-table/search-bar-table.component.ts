import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {v4 as uuidv4} from "uuid";

export interface SearchBarTableEntry {
  id: number;
  group?: string;
  name: string;
}

@Component({
  selector: 'app-search-bar-table',
  templateUrl: './search-bar-table.component.html',
  styleUrls: ['./search-bar-table.component.css']
})
export class SearchBarTableComponent implements OnInit {
  @Input() selectedValue: SearchBarTableEntry;
  @Input() allValues: SearchBarTableEntry[];
  @Input() inputTextColor: string;
  @Output() newValueEvent = new EventEmitter<SearchBarTableEntry>();

  previousSearchTableGroup: string = "";
  showSearchBarTable: boolean = false;
  filteredValuesJSON: SearchBarTableEntry[] = [];  // filtered endpoints after the user searches for a specific phrase

  // dynamic id for the HTML input element. Is needed if there are multiple searchbar tables.
  inputID: string;

  constructor() { }

  ngOnInit(): void {
    this.inputID = "searchBarTable-" + uuidv4();
    this.filteredValuesJSON = this.allValues;    // initialize filteredEndpoints to all
  }

  public openSearchBarTable() {
    this.filteredValuesJSON = this.allValues;
    this.showSearchBarTable = true;
    this.previousSearchTableGroup = "";
    // @ts-ignore
    (document.getElementById(this.inputID) as HTMLInputElement).value = '';
  }

  public closeSearchBarTable() {
    (document.getElementById(this.inputID) as HTMLInputElement).value = this.selectedValue.name;
    this.showSearchBarTable = false;
  }

  public handleTableSearchInput(inputEvent: any) {
    const input: string = inputEvent.target.value;
    this.previousSearchTableGroup = "";

    this.filteredValuesJSON = this.allValues.filter((endpoint: any) => {
      return endpoint.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    });

    console.log(this.filteredValuesJSON);
  }

  showSearchTableGroup(endpoint: any) {
    if (endpoint.group === undefined) {
      return;
    }

    if (endpoint.group !== this.previousSearchTableGroup) {
      this.previousSearchTableGroup = endpoint.group;
      return true;
    } else {
      return false;
    }
  }

  public changeSelectedValue(newValue: SearchBarTableEntry) {
    // @ts-ignore
    document.getElementById(this.inputID).setAttribute("value", newValue.name);

    this.newValueEvent.emit(newValue);
    this.closeSearchBarTable();
  }
}
